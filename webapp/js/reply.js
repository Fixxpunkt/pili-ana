var aAllComments = [];
var iCommentId;
var iDiscussionId;

(function () {
	let params = (new URL(document.location)).searchParams;
	iCommentId = params.get("id");
	iDiscussionId = params.get("dId");

	get_comments_by_discussionId(iDiscussionId).then(data => {
		aAllComments = Object.values(data.items.aData.Comments);
		comment = get_comment_by_commentid(iCommentId, aAllComments);
		$('.comment-user').text(comment.User);
		$('.comment-content').text(comment.comment);
		$('.comment-reply-btn').on('click', function(){ send_reply(iCommentId, comment); });
		$('.back-btn').on('click', function(){
			//window.location = '/comment?id='+iDiscussionId;
			router.navigate('comment?id='+iDiscussionId, false);
		});
	});
}());

var send_reply = function(iCommentId, comment){
	$('.comment-reply-btn, .comment-reply.load, .comment-reply-container, .reply-input').addClass('processing');
	$('.comment-reply-container').append($('.reply-input').val().replace(/\r?\n/g,'<br/>'));

	var the_loader = setInterval(fillCounter, 50, $('#loader'));
	$('#loader').on('loaderFinished', function(){
		clearInterval(the_loader);

		execute_approve_comment(iCommentId).then(data => {
			if (data.status == 1){
				iCommentId = comment.commentType == 'child' ? comment.parentId : iCommentId;
				execute_create_response(iCommentId, iDiscussionId, $('.reply-input').val()).then(data => {
					if (data.status == 1){
						$('.comment-status, .comment-status .approved').show();
						$('.comment-reply.load').removeClass('processing');
					}
				});
			}
		});
	});
};