interface SessionData {
  session_id: string;
  timestamp: number;
}

// Assuming the manifest has an "env" property with these keys
const manifestEnv = chrome.runtime.getManifest().env as {
  measurement_id: string;
  api_secret: string;
};

const MEASUREMENT_ID: string = manifestEnv.measurement_id;
const API_SECRET: string = manifestEnv.api_secret;
const GA_ENDPOINT: string = "https://www.google-analytics.com/mp/collect";
const DEFAULT_ENGAGEMENT_TIME_IN_MSEC: number = 6000;
const SESSION_EXPIRATION_IN_MIN: number = 5;

async function send(request: string): Promise<void> {
  fetch(
    `${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
    {
      method: "POST",
      body: JSON.stringify({
        client_id: await getOrCreateClientId(),
        events: [
          {
            name: request,
            params: {
              session_id: await getOrCreateSessionId(),
              engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
            },
          },
        ],
      }),
    }
  ).then((response: Response) => {
    console.log(request + " " + response.ok);
  });
}

chrome.runtime.onMessage.addListener(async (request: string) => {
  send(request);
});

const internalUrl: string = chrome.runtime.getURL("../src/html/landing.html");
chrome.runtime.onInstalled.addListener(function (
  details: chrome.runtime.InstalledDetails
) {
  console.log(details.reason);
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // send("install");
    chrome.tabs.create({ url: internalUrl }, function () {
      console.log("Installation detected");
    });
  }
});

async function getOrCreateClientId(): Promise<string> {
  const result = await chrome.storage.local.get("clientId");
  let clientId: string | undefined = result.clientId;
  if (!clientId) {
    // Generate a unique client ID; the actual value is not critical
    clientId = self.crypto.randomUUID();
    await chrome.storage.local.set({ clientId });
  }
  return clientId;
}

async function getOrCreateSessionId(): Promise<string> {
  const result = await chrome.storage.session.get("sessionData");
  let sessionData: SessionData | null =
    result.sessionData as SessionData | null;
  const currentTimeInMs: number = Date.now();

  if (sessionData && sessionData.timestamp) {
    const durationInMin: number =
      (currentTimeInMs - sessionData.timestamp) / 60000;
    if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
      // Session expired; reset it
      sessionData = null;
    } else {
      // Update timestamp to keep session alive
      sessionData.timestamp = currentTimeInMs;
      await chrome.storage.session.set({ sessionData });
    }
  }
  if (!sessionData) {
    // Create a new session
    sessionData = {
      session_id: currentTimeInMs.toString(),
      timestamp: currentTimeInMs,
    };
    await chrome.storage.session.set({ sessionData });
  }
  return sessionData.session_id;
}

console.log(
  "Vars: " +
    (MEASUREMENT_ID != null && API_SECRET != null ? "Loaded" : "Not Loaded")
);
