# pili-ana
The official pili-ana repository

Version: alpha 1.3

HOW TO SETUP APP

----------

- index.html
Insert user/editor id into attribute data-user on body tag

----------

- config.js
Insert API in this file.

overview:    URL to API to get discussions
discussion:  URL to API to get all comments of a discussion
approve:     URL to API to approve a comment
delete:      URL to API to delete a comment
respond:     URL to API to reply to a comment (approve associated comment and create new comment)
perspective: URL to perspective API
containerId: Google Tracking ID

---------

For local setup open terminal, navigate to webapp and enter 'node server' (server.js)