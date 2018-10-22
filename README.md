# pili-ana
The official pili-ana repository

Version: Beta 1.0

## Content Table
- Introduction
- Setup
- Methods
  - main.js
  - dashboard.js
  - comment.js
  - reply.js

----------

## Introduction
pili-ana is a javascript-only app which allows journalists to efficiently interact
with the highlighted opportunities, approve or delete user comments and
to reply to user comments.

- css
  - dashboard.css
  - icons.css
  - loader.css
  - main.css
- js
  - comment.js
  - dashboard.js
  - gtm.js
  - loader.js
  - main.js - contains main methods
  - reply.js
- library
  - navigo.js
  - sly.min.js
- media
  - sprites
- view
  - comment.html
  - dashboard.html
  - reply.html
- config.js - all api paths go here
- router.js
- server.js
- readme.md

----------

## Setup
#### Configuration

index.html - Insert user/editor id into attribute data-user on body tag

config.js - Insert API in this file.
```
const config = {
  name: string,
  language: string,
  api : {
    overview : string,
    discussion : string,
    approve : string,
    delete : string,
    respond : string,
    perspective : string,
  },
  gtm: {
    containerId : string
  }
}
```

- name:		   Name of the App
- language:    Language of the App. It is also used for Perspective APIs language
- overview:    URL to API to get all discussions
- discussion:  URL to API to get all comments of a discussion
- approve:     URL to API to approve a comment
- delete:      URL to API to delete a comment
- respond:     URL to API to reply to a comment (approves associated comment and sends editor's response)
- perspective: URL to perspective API
- containerId: Google Tag Manager ID

#### How to run the app
###### Local (will be handled by server.js)
- open terminal and navigate to webapp folder
- use ``` node server ``` to start local server
- open localhost:8888 in any browser

###### Server
Routing will be made by router.js that depends in library/navigo.js.
A htaccess-file shoud be in place for browser refresh.

----------

## Methods
### main.js - main methods

###### get_discussions ()
Calls ``` config.api.overview ``` to get all available discussions using
the Web APIs' fetch method. Make the response data available by using .then().
```
get_discussion().then(data => { //response code goes here })
```

Response data must be provided from API as follows:
```
{
  "items": {
    "Discussions: [{
      "id": int,
      "waiting_count": int,
      "total_count": int,
      "title": string,
      "authors": {
        int: string,
        int: string
      },
      "date": string (YYYY-MM-DD HH:mm:ss)
    }]
  }
}
```

###### get_comments_by_discussionId ( iDiscussionId: int )
Calls ``` config.api.discussion ``` to get all comments of a discussion
by passing a discussion id. Make the response data available by using .then().
```
get_comments_by_discussionId(_DISCUSSION_ID_).then(data => { //response code goes here })
```

Response data must be provided from API as follows:
```
{
"items": {
  "aData": {
    "Discussion": {
      "authors": {
        int: string
      },
      "title": string
      },
      "Comments": {
        int: {
          "id": int,
          "User": {
            "username": string,
            "alert": int,
            "quote": int,
            "cleared": int
          },
          "comment": string,
          "media": string,
          "status": int,
          "date": string (YYYY-MM-DD HH:mm:ss)
        }
      }
    }
  }
}
```

###### get_open_comments ( aAllComments: obj )
Returns an array with comments that are to be proved (status = 0).
It checks the parents' status, looks for children and checks their status as well.
- __aAllComments__ ```Object``` Array object with all available comments with status 0

###### get_comment_by_commentid ( iCommentId: int, aCommentItems: obj )
Returns a single comment object by passing a comment id and the array of comments where to look for.
- __iCommentId__ ```Integer``` Id of comment to be returned
- __aCommentItems__ ```Object``` Array object with all comments where to find a comment

###### get_toxicity ( text: str )
Returns an object with toxicity scores from config.api.perspective.
- __text__ ```String``` Comment string to get the toxicity scores from

See the [Perspective API documentation](https://github.com/conversationai/perspectiveapi/blob/master/api_reference.md) for response data.

###### execute_delete_comment ( iCommentId: int, iDiscussionId: int )
Calls ```config.api.delete``` to reject a comment by giving the current comment id and discussion id.
Make the response data available by using .then().
- __iCommentId__ ```Integer``` Id of the comment that is to be rejected
- __iDiscussionId__ ```Integer``` Discussion id where the comment belongs to
```
execute_delete_comment(_COMMENT_ID_, _DISCUSSION_ID_).then(data => { // data.status == 1 for success });
```

###### execute_approve_comment ( iCommentId: int )
Calls ```config.api.approve``` to accept a comment by giving the current comment id.
Make the response data available by using .then().
- __iCommentId__ ```Integer``` Id of the comment that is accepted
```
execute_approve_comment(_COMMENT_ID_).then(data => { // data.status == 1 for success });
```

###### execute_create_response ( iCommentId: int, iDiscussionId: int, sComment: str )
Calls ```config.api.respond``` to accept the users comment and create a editor response comment
by passing the comment id to respond to, the discussion id and the response text. 
Access response data by using .then().
- __iCommentId__ ```Integer``` Id of the comment to be responded to
- __iDiscussionId__ ```Integer``` Discussion id where the comment belongs to
- __sComment__ ```String``` Response text to the users comment
```
execute_create_response(_COMMENT_ID_, _DISCUSSION_ID_, _RESPONSE_TEXT_).then(data => { // data.status == 1 for success });
```

### dashboard.js

###### initDashboard ( iCommentId: int )
Initializes the dashboard and activate slider functionality
after getting the data object by calling ```get_discussions()```.

### comment.js

###### load_comment ( index: int )
Loads one comment out of aComments array with all open comments to the view. 
If the current comment is a child, its parent and all approved child comments 
are listed with ```add_comment()``` to the view.

###### add_comment ( commentItem: obj )
Adds parent comment and all approved child comments to the view with status = 1.

###### delete_comment ()
Rejects the current comment. Calls ```execute_delete_comment()``` in main.js.

###### approve_comment ()
Accepts the current comment. Calls ```execute_approve_comment()``` in main.js.

###### get_comment_id ()
Returns the comment id set in a data attribute of the view. 

###### get_comment_index ( commentId: int )
Finds and returns the index of the current comment in ```aComments``` array.

### reply.js

###### send_reply ( iCommentId: int, comment: obj )
Accepts current comment and sends editor's response comment.
Calls ```execute_approve_comment()``` in main.js.