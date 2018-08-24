(function () {
	console.log('REPLY INIT');
	let params = (new URL(document.location)).searchParams;
	commentId = params.get("id");
	discussionId = params.get("dId");
	console.log(commentId);

	fetch(config.api.discussion+'?id='+discussionId)
		.then(response => response.json())
		.then(data => {
			console.log(data);
			parentItem = data.items.aData.Comments;
			commentItem = getComment(commentId, Object.values(parentItem));
			commentItem.commentType = 'parent';
			if (!commentItem) {
				for (parentKey in parentItem) {
					if (parentItem[parentKey].children) {
						commentItem = getComment(commentId, Object.values(parentItem[parentKey].children));
						commentItem.commentType = 'child';
						commentItem.parentId = parentItem[parentKey].id;
						if (commentItem){
							break;
						}
					}
				}
			}

			$('.comment-user').text(commentItem.User);
			$('.comment-content').text(commentItem.comment);
		})
		.then(done => {

			$('.back-btn').on('click', function(){
				window.location = '/comment?id='+discussionId;
			});
			$('.comment-reply-btn').on('click', function(){
				sendReply();
			});
		})
}());

var getComment = function(commentId, commentItems){
	commentItem = commentItems.find(function(element){
		return element.id == commentId;
	});
	return commentItem;
};

var sendReply = function(){
	$('.comment-reply-btn, .comment-reply.load, .comment-reply-container, .reply-input').addClass('processing');
	$('.comment-reply-container').append($('.reply-input').val().replace(/\r?\n/g,'<br/>'));

	var the_loader = setInterval(fillCounter, 50, $('#loader'));
	$('#loader').on('loaderFinished', function(){
		clearInterval(the_loader);

		fetch(config.api.approve+'?id='+commentId)
			.then(res => res.json())
			.then(data => {
				if (data.status == 1){
					commentId = commentItem.commentType == 'child' ? commentItem.parentId : commentId;
					fetch(config.api.respond+'?id='+commentId+'&iDiscussionId='+discussionId+'&comment='+encodeURI($('.reply-input').val()))
						.then(res => res.json())
						.then(data => {
								if (data.status == 1){
								$('.comment-status, .comment-status .approved').show();
								$('.comment-reply.load').removeClass('processing');
							}
						})
				}
			})
	});
};