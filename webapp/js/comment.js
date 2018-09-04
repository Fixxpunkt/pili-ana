var aAllComments = [];
var aComments = [];
var iDiscussionId;

(function () {
	let params = (new URL(document.location)).searchParams;
	iDiscussionId = params.get("id");

	get_comments_by_discussionId(iDiscussionId).then(data => {
		aAllComments = Object.values(data.items.aData.Comments);
		aComments = get_open_comments(aAllComments);

		$('.comment-title').text(data.items.aData.Discussion.title);

		var iCurrentIndex = load_comment(0);
		$('.skip-btn').on('click', function(){
			gtm_skip_event();
			iCurrentIndex = load_comment((iCurrentIndex+1));
		});
		$('.show-btn').on('click', function(){
			$('.discussion-container').removeClass('collapsed');
		});

		$('.action-btns, .comment-container.new').css('visibility', 'visible');
		$('.delete-btn').on('click', function() {
			delete_comment();
			gtm_decline_btn_event();
		});
		$('.approve-btn').on('click', function(){
			approve_comment();
			gtm_approve_btn_event();
		});
		$('.reply-btn').on('click', function(){
			//window.location = '/reply?id='+get_comment_id()+'&dId='+iDiscussionId;
			router.navigate('reply?id='+get_comment_id()+'&dId='+iDiscussionId, false);
			gtm_reply_btn_event();
		});

		router.updatePageLinks()
		initializeTouch();
	});
	$('.back-btn').on('click', function(){
		gtm_back_event();
	});
}());

var ongoingTouches = {
	swipe: false,
	w: 0,
	lw: 0,
	rw: 0,
	ml: 0
};
function initializeTouch(){
	$el = $('.comment-container.new');
	$el.on('touchstart', handleStart);
	$el.on('touchend', handleEnd);
	$el.on('touchcancel', handleCancel);
	$el.on('touchmove', handleMove);
}
function handleStart(evt){
	var touches = evt.changedTouches;
	ongoingTouches.w = $(touches[0].target).width();
	ongoingTouches.lw = touches[0].clientX - parseInt($(touches[0].target).css('marginLeft'));
	ongoingTouches.rw = $(touches[0].target).width() - touches[0].clientX + parseInt($(touches[0].target).css('marginLeft'));
	ongoingTouches.ml = parseInt($(touches[0].target).css('marginLeft'));

	if ( !$('.comment-container.new').hasClass('child') || $('.comment-container.new').hasClass('child') && !$('.discussion-container').hasClass('collapsed')){
		ongoingTouches.swipe = true;
	}
}
function handleEnd(evt){
	var touches = evt.changedTouches;
	var curX = touches[0].clientX;
	var lw = ongoingTouches.lw;
	var rw = ongoingTouches.rw;

	if (lw > 50 && getLP(curX) > 0.8 && ongoingTouches.swipe){
		delete_comment();
	} else if (rw > 50 && getRP(curX) > 0.8 && ongoingTouches.swipe){
		approve_comment();
	}

	ongoingTouches = {
		swipe: false,
		w: 0,
		lw: 0,
		rw: 0,
		ml: 0
	}
}
function handleCancel(evt){

}
function handleMove(evt){
	var touches = evt.changedTouches;
	var curX = touches[0].clientX;
	var lw = ongoingTouches.lw;
	var rw = ongoingTouches.rw;
	var ml = ongoingTouches.ml;

	if ( curX-ml < lw && lw > 50 && Math.abs(lw-curX-ml) > 50 && ongoingTouches.swipe){
		$('.swipe-delete').addClass('swipe');
		$('.delete-btn').addClass('swipe');
		$('.approve-btn').removeClass('swipe');
		if (getLP(curX) > 0.8 || Math.abs(lw-curX-ml) > 100){
			$('.delete-btn').addClass('ready');
		} else {
			$('.delete-btn').removeClass('ready');
		}
	} else if ( curX-ml > lw && rw > 50 && Math.abs(curX-ml-lw) > 50 && ongoingTouches.swipe){
		$('.swipe-approve').addClass('swipe');
		$('.delete-btn').removeClass('swipe');
		$('.approve-btn').addClass('swipe');
		if (getRP(curX) > 0.8 || Math.abs(curX-ml-lw) > 100){
			$('.approve-btn').addClass('ready');
		} else {
			$('.approve-btn').removeClass('ready');
		}
	} else {
		resetSwipe();
	}
}

function resetSwipe(){
	$('.swipe-delete').removeClass('swipe');
	$('.swipe-approve').removeClass('swipe');
	$('.approve-btn').removeClass('swipe');
	$('.delete-btn').removeClass('swipe');
	$('.approve-btn').removeClass('ready');
	$('.delete-btn').removeClass('ready');
}

function getLP(curX){
	var lw = ongoingTouches.lw;
	var ml = ongoingTouches.ml;
	return 1/lw*(lw-curX-ml);
}
function getRP(curX){
	var lw = ongoingTouches.lw;
	var rw = ongoingTouches.rw;
	var ml = ongoingTouches.ml;
	return 1/rw*(curX-ml-lw);
}

var load_comment = function(index) {
	$('.discussion-container').addClass('collapsed');
	$('.discussion-container').empty();

	if (index < aComments.length) {
		$('.comment-counter').text((index + 1) + '/' + aComments.length);
		$('.progress-bar progress').val(100/aComments.length*(index+1));

		var comment = aComments[index];
		// Load all approved associative comments
		if (comment.commentType == 'child'){
			var parentItem = aAllComments.find(function(element){
				return element.id == comment.parentId;
			});
			add_comment(parentItem);

			for (key in parentItem.children){
				if (parentItem.children[key].status != 0){
					add_comment(parentItem.children[key]);
				}
			}
		}

		send_comment_cd(comment.id, comment, iDiscussionId);
		
		// Display comment to be approved
		$('.comment-container.new').removeClass('parent child');
		$('.comment-container.new').addClass(comment.commentType);
		$('.comment-container.new').data('comment-id', comment.id);
		$('.comment-container.new .comment-user').text(comment.User);
		$('.comment-container.new .comment-timestamp').text(comment.date);
		$('.comment-container.new .comment-content').text(comment.comment);

		// Get toxicity data and display on comment
		get_toxicity(comment.comment).then(data => {
			this.score = data.attributeScores.TOXICITY.summaryScore.value;

			var toxicityColor = 'neutral';
			if (this.score > 0.75){
				toxicityColor = 'bad';
			} else if (this.score < 0.25) {
				toxicityColor = 'good';
			}

			var toxicity = Math.round(this.score*100);
			$('.comment-toxicity').text('Toxicity '+ toxicity +'%');
			$('.comment-toxicity').removeClass('good neutral bad').addClass(toxicityColor);
 			GTM.addToDataLayer('commentToxicLevel', toxicity + '%');

		});

	} else if (aComments.length == 0){
		router.navigate('', false);
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
			resetSwipe();
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
			resetSwipe();
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
