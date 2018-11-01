var aAllComments = [];
var iCommentId;
var iDiscussionId;

(function () {
	let params = (new URL(document.location)).searchParams;
	iCommentId = params.get("id");
	iDiscussionId = params.get("dId");

	get_comments_by_discussionId(iDiscussionId).then(data => {
		if (data != 'undefined')
	{
		aAllComments = Object.values(data.items.aData.Comments);
		comment = get_comment_by_commentid(iCommentId, aAllComments);
		$('.comment-user').text(comment.User.username);
		$('.comment-content > p').html($.nl2br(comment.comment));
		$('.comment-content').height($('.comment-content > p').height());

		$('.comment-reply-btn').on('click', function () {
			send_reply(iCommentId, comment);
			gtm_reply_event();
		});
		$('.back-btn').on('click', function () {
			gtm_back_event();
			router.navigate('comment?id=' + iDiscussionId, false);
		});
		$('.reply-input').keyup(function (e) {
			checkTextarea($(this));
		});
		$('.reply-input').on('paste', function (e) {
			$this = $(this);
			setTimeout(function () {
				checkTextarea($this);
			}, 100);
		});
		send_comment_cd(iCommentId, comment, iDiscussionId);
	}
}).catch(error => {})
}());

function checkTextarea($el){
	if ($el.val().length > 0){
		$('.comment-reply-btn').removeClass('off');
	} else {
		$('.comment-reply-btn').addClass('off');
	}
	if ($el.val().length < 600){
		$('.comment-reply-btn').removeClass('processing');
		$('.reply-status-message').text('');
	}
}

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
				if (data.status && data.status == 1){
				$('.comment-status, .comment-status .approved').show();
				$('.comment-reply.load').removeClass('processing');
				setTimeout(function(){
					router.navigate('comment?id='+iDiscussionId, false);
				}, 700);
			}
			if (data.error && data.error == 1){
				$('.comment-reply.load, .comment-reply-container, .reply-input').removeClass('processing');
				$('.reply-status-message').text(data.message);
			}
		}).catch(error => { $('.comment-reply.load').hide(); })
		}
	}).catch(error => { $('.comment-reply.load').hide(); })
	});
};
