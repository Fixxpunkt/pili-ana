# Pili-Ana
The official pili-ana repository

Version: 1.0.0

pili-ana is a javascript-only app which allows journalists to efficiently interact
with the highlighted opportunities, approve or delete user comments and
to reply to user comments.

## Getting Started
### 1a. Download Pili-Ana
Download required Pili-Ana files:
- css
  - piliana.css
- js
  - piliana.js
- view
  - dashboard.html
  - comment.html
  - reply.html
- index.html (demo html file)
- server.js (only needed for local testing/development)

### 1b. Use Pili-Ana via CDN
It's also possible to use Pili-Ana via CDN:
```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Fixxpunkt/pili-ana/css/piliana.css">
<script src="https://cdn.jsdelivr.net/gh/Fixxpunkt/pili-ana/js/piliana.js"></script>
```

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
<div class="piliana-container"></div>
```

### 4. Initialize Pili-Ana
Finally initialize Pili-Ana in JS. There are few options required to be set:
```
<script>
var myPiliana = new Piliana('.piliana-container', {
  language: string,
  api: {
    overview: string,
    discussion: string,
    approve: string,
    delete: string,
    respond: string,
    perspective: string,
  },
  gtm: {
    containerId: string
  },
  cdn: boolean
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
- cdn:		   set to **true** if you want the view files to be loaded via CDN

## How to run the app locally
- open terminal and navigate to piliana folder
- use ``` node server ``` to start local server handled by server.js (node.js needed to be installed)
- open localhost:8888 in any browser

