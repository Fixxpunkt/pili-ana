# Pili-Ana
The official pili-ana repository

Version: 1.0.0

pili-ana is a javascript-only app which allows journalists to efficiently interact
with the highlighted opportunities, approve or delete user comments and
to reply to user comments.

## Getting Started
### 1. Download Pili-Ana
Download required Pili-Ana files:
- css
  - piliana.css
- js
  - piliana.js
- media
  - sprites
    - icons.png
- view
  - comment.html
  - dashboard.html
  - reply.html
- index.html (demo html file)
- server.js (only needed for local test with node.js)
- readme.md

### 2. Include Pili-Ana Files To Website/App
Include Pili-Ana's CSS and JS files to your html file:
```
<!DOCTYPE html>
<html lang="en">
<head>
    ...
    <link rel="stylesheet" href="path/to/piliana.css">
</head>
<body>
    ...
    <script src="path/to/piliana.js"></script>
</body>
</html>
```

### 3. Add Pili-Ana HTML Layout
Now add basic Pili-Ana layout to your app:
```
<div id="piliana-container" class="piliana-container"></div>
```

### 4. Initialize Pili-Ana
Finally initialize Pili-Ana in JS. There are few options required to be set:
```
<script>
var myPiliana = new Piliana('#piliana-container', {
  language: "",
  api: {
    overview: "",
    discussion: "",
    approve: "",
    delete: "",
    respond: "",
    perspective: "",
  },
  gtm: {
    containerId: ""
  }
});
</script>
```

- language:    Language of the App (en, de, ...). It is also used for Perspective APIs language
- overview:    URL to API to get all discussions
- discussion:  URL to API to get all comments of a discussion
- approve:     URL to API to approve a comment
- delete:      URL to API to delete a comment
- respond:     URL to API to reply to a comment (approves associated comment and sends editor's response)
- perspective: URL to perspective API
- containerId: Google Tag Manager ID

## How to run the app locally
- open terminal and navigate to webapp folder
- use ``` node server ``` to start local server (handled by server.js)
- open localhost:8888 in any browser

