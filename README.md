# Help Me Bevo

A extension to see the <i>infamous</i> Bevo 3rd down animation when you submit a Canvas assignment!

Tired of being demotivated to get assignments done?
Let Bevo take that burden away, and see his infamous 3rd down animation (the OG one) every time you submit a Canvas assignment.

![Extension Image](https://lh3.googleusercontent.com/nV0uRjXJ9PRps2P3YY9rYKPUT-yYxGjKgwpmO6njmjV1kXdv4rJNr6LxXtz1gRBOB1eKHVyj6CPcpI_Kf791uBfV1jw=s1280-w1280-h800)

## Features

- See the infamous Bevo 3rd down animation every time you submit a Canvas assignment!
- Automatic Saved Settings
- Assignment Names over Bevo Rush Animation
- Stat Tracking
  - Under the hood, there are even more stats being stored for Help Me Bevo: Wrapped
- Help Me Bevo: Wrapped
  - A Spotify Wrapped inspired video that displays the user's submission habits/behaviors at the end of every semester
- Settings:
  - Enable/Disable Extension
  - Toggle Functionality for:
    - Canvas Assignments
    - Quizzes
    - Other "Submit" Assignments
    - Google Classroom
    - Gradescope
  - Volume
  - Full Screen Mode
- Random UT Theme Quote

## Link to Extension:

<b>Chromium Browsers: </b>https://chromewebstore.google.com/detail/help-me-bevo/igepffgmogjaehnlpgepliimadegcapd
<br />
<b>Firefox:</b> https://addons.mozilla.org/en-US/firefox/addon/help-me-bevo/
<br />
<br />
[You can view all chromium browsers here](<https://en.wikipedia.org/wiki/Chromium_(web_browser)>)

## Release Installation

It is <b>recommended to download from the web store </b> for convenience.</i>
Only install from the ZIP for experimental/testing purposes.

These instructions are for installing via the ZIP file from the GitHub release <i>for chromium based browsers only</i>.

- Download the ZIP release
- Go to the URL "chrome://extensions" (or go to your browser's Extensions page)
- Turn on Developer Mode on the top right
- Click "Load unpacked"
- Select the ZIP file

<i>Note: These will not receive automatic updates from the Chrome Web Store. It is <b>recommended to download from the web store instead</b> for convenience.</i>

## Setup

1. Clone the repository.
2. Run `pnpm install`.

OPTIONAL STEPS:
3. Create a `.env` file in the root directory with the following content:
   ```env
   VITE_API_SECRET=secret_here
   VITE_MEASUREMENT_ID=measurement_id_here
   ```
4. Replace both variables with the API Secret and Measurement ID strings given in a Google Analytics data stream/collection.

## Building

1. Run `pnpm run build` to create a build folder.
2. Load the extension by going to `chrome://extensions` (or whatever your browser uses) and click Load Unpacked and selecting the `build` folder.

## Developing

You don't have to build every time you want to see a change happen. Simply run `pnpm run dev` and the extension popup will be within a webpage hosted locally. Changes will automatically update within the page.

## Credit

Thank you to the YikYak community for originally suggesting this idea!
The idea originally came from YikYak, and it was upvoted a ton. I needed to work on some side projects, so it was the perfect opportunity to create an extension. Not only build my portfolio but also please the UT students (and of course for the assignment motivation).

Credits to the UT media team for the animation.

Thank you @EthanL06 for the design of the extension popup.

Hook 'em!
