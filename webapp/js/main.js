var author_id = $('body').data('user');//592727968;

var get_discussions = function(){
	return fetch(config.api.overview).then(res => res.json());
};

var get_comments_by_discussionId = function(iDiscussionId){
	return fetch(config.api.discussion+'?id='+iDiscussionId).then(res => res.json());
};

var get_open_comments = function(aAllComments){
	var aComments = [];
	for (parentKey in aAllComments){

		// parents
		aAllComments[parentKey].commentType = 'parent';
		if (aAllComments[parentKey].status == 0){
			aComments.push(aAllComments[parentKey]);
		}

		// children
		if (aAllComments[parentKey].children && Object.keys(aAllComments[parentKey].children).length > 0){
			childItem = aAllComments[parentKey].children;
			for (childKey in childItem){
				childItem[childKey].commentType = 'child';
				childItem[childKey].parentId = aAllComments[parentKey].id;
				if (childItem[childKey].status == 0){
					aComments.push(childItem[childKey]);
				}
			}
		}
	}
	return aComments;
};

var get_comment_by_commentid = function(iCommentId, aCommentItems){
	var commentItem = aCommentItems.find(function(element){
		return element.id == iCommentId;
	});

	if (!commentItem) {
		for (key in aCommentItems) {
			if (aCommentItems[key].children) {
				commentItem = get_comment_by_commentid(iCommentId, Object.values(aCommentItems[key].children));
				if (commentItem) {
					commentItem.commentType = 'child';
					commentItem.parentId = aCommentItems[key].id;
					break;
				}
			}
		}
	} else {
		commentItem.commentType = 'parent';
	}

	return commentItem;
};

var get_toxicity = function(text) {
	this.score = 0;

	var objComment = {
		comment: {
			text: text
		},
		languages: ["en"],
		requestedAttributes: {
			TOXICITY: {}
		}
	};

	return fetch(config.api.perspective, {
		method: 'POST',
		body: JSON.stringify(objComment),
		headers:{
			'Content-Type': 'application/json'
		}
	}).then(res => res.json());
};

var execute_delete_comment = function(iCommentId, iDiscussionId){
	return fetch(config.api.delete+'?id='+iCommentId+'&iDiscussionId='+iDiscussionId).then(res => res.json());
};

var execute_approve_comment = function(iCommentId){
	return fetch(config.api.approve+'?id='+iCommentId).then(res => res.json());
};

var execute_create_response = function(iCommentId, iDiscussionId, sComment){
	return fetch(config.api.respond+'?id='+iCommentId+'&iDiscussionId='+iDiscussionId+'&comment='+encodeURI(sComment)).then(res => res.json());
};

jQuery.nl2br = function(sContent){
	return sContent.replace(/(\r\n|\n\r|\r|\n)/g, "<br>");
};
