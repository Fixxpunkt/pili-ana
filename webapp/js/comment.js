var aAllComments = [];
var aComments = [];
var iDiscussionId;

(function () {
	let params = (new URL(document.location)).searchParams;
	iDiscussionId = params.get("id");

	get_comments_by_discussionId(iDiscussionId).then(data => {
		aAllComments = Object.values(data.items.aData.Comments);
		aComments = get_open_comments(aAllComments);

		var iCurrentIndex = load_comment(0);
		$('.skip-btn').on('click', function(){
			iCurrentIndex = load_comment((iCurrentIndex+1));
		});
		$('.show-btn').on('click', function(){
			$('.discussion-container').removeClass('collapsed');
		});

		$('.action-btns, .comment-container.new').css('visibility', 'visible');
		$('.delete-btn').on('click', delete_comment);
		$('.approve-btn').on('click', approve_comment);
		$('.reply-btn').on('click', function(){
			window.location = '/reply?id='+get_comment_id()+'&dId='+iDiscussionId;
		});
	});
}());

var load_comment = function(index) {
	$('.discussion-container').addClass('collapsed');
	$('.discussion-container').empty();

	if (index < aComments.length) {
		$('.comment-counter').text((index + 1) + '/' + aComments.length);
		$('.progress-bar progress').val(100/aComments.length*(index+1));

		// Load all approved associative comments
		if (aComments[index].commentType == 'child'){
			var parentItem = aAllComments.find(function(element){
				return element.id == aComments[index].parentId;
			});
			add_comment(parentItem);

			for (key in parentItem.children){
				if (parentItem.children[key].status != 0){
					add_comment(parentItem.children[key]);
				}
			}
		}

		// Display comment to be approved
		$('.comment-container.new').removeClass('parent child');
		$('.comment-container.new').addClass(aComments[index].commentType);
		$('.comment-container.new').data('comment-id', aComments[index].id);
		$('.comment-container.new .comment-user').text(aComments[index].User);
		$('.comment-container.new .comment-timestamp').text(aComments[index].date);
		$('.comment-container.new .comment-content').text(aComments[index].comment);

		// Get toxicity data and display on comment
		get_toxicity(aComments[index].comment).then(data => {
			this.score = data.attributeScores.TOXICITY.summaryScore.value;

			var toxicityColor = 'neutral';
			if (this.score > 0.75){
				toxicityColor = 'bad';
			} else if (this.score < 0.25) {
				toxicityColor = 'good';
			}

			$('.comment-toxicity').text('Toxicity '+Math.round(this.score*100)+'%');
			$('.comment-toxicity').removeClass('good neutral bad').addClass(toxicityColor);
		});
	} else {
		window.location = '/';
	}

	return index;
};

var add_comment = function(commentItem){
	var html = '';
	html += '<div class="comment-container '+commentItem.commentType+'">';
	html += '<div class="comment-meta">';
	html += '<div class="comment-user">'+commentItem.User+'</div>';
	html += '<div class="comment-timestamp">'+commentItem.date+'</div>';
	html += '</div>';
	html += '<div class="comment-content">'+commentItem.comment+'</div>';
	html += '</div>';
	$('.discussion-container').append(html);
};

var delete_comment = function(){
	var iCommentId = get_comment_id();
	var iCurrentIndex = get_comment_index(iCommentId);

	execute_delete_comment(iCommentId, iDiscussionId).then(data => {
		if (data.status == 1){
			$('.comment-status, .comment-status .deleted').show().delay(600).fadeOut(200);
			$('.action-btns').hide();
			setTimeout(function() {
				aComments.splice(iCurrentIndex, 1);
				if (iCurrentIndex == aComments.length && aComments.length != 0) {
					iCurrentIndex--;
				}
				load_comment(iCurrentIndex);
				$('.action-btns').show();
			}, 700);
		}
	})
};

var approve_comment = function(){
	var iCommentId = get_comment_id();
	var iCurrentIndex = get_comment_index(iCommentId);

	execute_approve_comment(iCommentId).then(data => {
		if (data.status == 1){
			$('.comment-status, .comment-status .approved').show().delay(600).fadeOut(200);
			$('.action-btns').hide();
			setTimeout(function(){
				aComments[iCurrentIndex].status = 1;
				aComments.splice(iCurrentIndex, 1);
				if (iCurrentIndex == aComments.length && aComments.length != 0){
					iCurrentIndex --;
				}
				load_comment(iCurrentIndex);
				$('.action-btns').show();
			}, 700);
		}
	})
};

var get_comment_id = function(){
	return $('.comment-container.new').data('comment-id');
};

var get_comment_index = function(commentId){
	var index = aComments.findIndex(function(element){ return element.id == commentId; });
	return index;
};