var aAllComments = [];
var aComments = [];
var iDiscussionId;

(function () {
	let params = (new URL(document.location)).searchParams;
	iDiscussionId = params.get("id");

	get_comments_by_discussionId(iDiscussionId).then(data => {
		if (data != 'undefined')
	{
		aAllComments = Object.values(data.items.aData.Comments);
		aComments = get_open_comments(aAllComments);

		$('.comment-title').text(data.items.aData.Discussion.title);
		$('.comment-title').attr('href', '/!' + iDiscussionId);

		var iCurrentIndex = load_comment(0);
		$('.skip-btn').on('click', function () {
			gtm_skip_event();
			iCurrentIndex = load_comment((iCurrentIndex + 1));
		});
		$('.show-btn').on('click', function () {
			$('.discussion-container').removeClass('collapsed');
			gtm_discussion_event();
		});

		$('.action-btns, .comment-container.new').css('visibility', 'visible');
		$('.delete-btn').on('click', function () {
			delete_comment();
			gtm_decline_btn_event();
		});
		$('.approve-btn').on('click', function () {
			approve_comment();
			gtm_approve_btn_event();
		});
		$('.reply-btn').on('click', function () {
			router.navigate('reply?id=' + get_comment_id() + '&dId=' + iDiscussionId, false);
			gtm_reply_btn_event();
		});

		$('.back-btn').on('click', function () {
			gtm_back_event();
			gtm_fire_pageEvent();
		});

		router.updatePageLinks();
		initializeTouch($('.comment-container.new'));
		$('.loaderOverlay').empty().fadeOut().delay(800).remove();
	}
}).catch(error => {})
}());

var ongoingTouches = {
	swipe: false,
	w: 0,		// width of swipe element
	lw: 0,		// left width from touch point
	rw: 0,		// right width from touch point
	ml: 0,		// margin left
	y: 0,		// touch point y
	sT: 0.7,	//swipe tolerance
	sW: 50		// swipe width
};
function initializeTouch($el){
	$el.on('touchstart', handleStart);
	$el.on('touchend', handleEnd);
	$el.on('touchcancel', handleCancel);
	$el.on('touchmove', handleMove);
}
function pauseTouch($el){
	$el.off('touchend');
	$el.off('touchmove');
}
function resumeTouch($el){
	$el.on('touchend', handleEnd);
	$el.on('touchmove', handleMove);
}
function deactivateTouch($el){
	$el.off('touchstart');
	$el.off('touchend');
	$el.off('touchcancel');
	$el.off('touchmove');
}
function handleStart(evt){
	var touches = evt.changedTouches;
	ongoingTouches.w = $(touches[0].target).width();
	ongoingTouches.lw = touches[0].clientX - parseInt($(touches[0].target).css('marginLeft'));
	ongoingTouches.rw = $(touches[0].target).width() - touches[0].clientX + parseInt($(touches[0].target).css('marginLeft'));
	ongoingTouches.ml = parseInt($(touches[0].target).css('marginLeft'));
	ongoingTouches.y = touches[0].clientY;
	resumeTouch($(this));

	if ( !$('.comment-container.new').hasClass('child') || $('.comment-container.new').hasClass('child') && !$('.discussion-container').hasClass('collapsed')){
		ongoingTouches.swipe = true;
	}
}
function handleEnd(evt){
	var touches = evt.changedTouches;
	var curX = touches[0].clientX;
	var lw = ongoingTouches.lw;
	var rw = ongoingTouches.rw;
	var ml = ongoingTouches.ml;
	var sT = ongoingTouches.sT;
	var sW = ongoingTouches.sW;
	var vDelta = Math.round(Math.abs(ongoingTouches.y - touches[0].clientY));

	if ($('.action-btns').isInViewport()) {
		if (curX - ml < lw && lw > sW && getLP(curX) > sT && ongoingTouches.swipe && vDelta < sW) {
			delete_comment();
			gtm_decline_swipe_event();
		} else if (curX - ml > lw && rw > sW && getRP(curX) > sT && ongoingTouches.swipe && vDelta < sW) {
			approve_comment();
			gtm_approve_swipe_event();
		} else {
			resetSwipe();
		}
	}

	ongoingTouches.swipe = false;
	ongoingTouches.w = 0;
	ongoingTouches.lw = 0;
	ongoingTouches.rw = 0;
	ongoingTouches.ml = 0;
	ongoingTouches.y = 0;
}
function handleCancel(evt){

}
function handleMove(evt){
	var touches = evt.changedTouches;
	var curX = touches[0].clientX;
	var lw = ongoingTouches.lw;
	var rw = ongoingTouches.rw;
	var ml = ongoingTouches.ml;
	var sT = ongoingTouches.sT;
	var sW = ongoingTouches.sW;
	var vDelta = Math.round(Math.abs(ongoingTouches.y - touches[0].clientY));

	if ($('.action-btns').isInViewport()) {
		if (curX - ml < lw && lw > sW && Math.abs(lw - curX - ml) > sW && ongoingTouches.swipe && vDelta < sW) {
			$('.delete-btn').addClass('swipe');
			$('.approve-btn').removeClass('swipe');
			if (getLP(curX) > sT) {
				$('.delete-btn').addClass('ready');
				$('.swipe-delete').addClass('swipe');
			} else {
				$('.delete-btn').removeClass('ready');
				$('.swipe-delete').removeClass('swipe');
			}
		} else if (curX - ml > lw && rw > sW && Math.abs(curX - ml - lw) > sW && ongoingTouches.swipe && vDelta < sW) {
			$('.delete-btn').removeClass('swipe');
			$('.approve-btn').addClass('swipe');
			if (getRP(curX) > sT) {
				$('.approve-btn').addClass('ready');
				$('.swipe-approve').addClass('swipe');
			} else {
				$('.approve-btn').removeClass('ready');
				$('.swipe-approve').removeClass('swipe');
			}
		} else if (vDelta > sW) {
			pauseTouch($(this));
			resetSwipe();
		}
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
	if (index < aComments.length) {
		$('.discussion-container').addClass('collapsed');
		$('.discussion-container').empty();

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

		// Display comment to be approved
		$('.comment-container.new').removeClass('parent child');
		$('.comment-container.new').addClass(comment.commentType);
		$('.comment-container.new').data('comment-id', comment.id);
		$('.comment-container.new .comment-user').text(comment.User.username);
		$('.comment-container.new .comment-timestamp').html(parseDate(comment.date));
		$('.comment-container.new .comment-user-stats').html('Freigeschaltet: ' + comment.User.cleared + ' | ' + comment.User.quote + '%');
		$('.comment-container.new .comment-content').html($.nl2br(comment.comment));
		convert_youtube_links($('.comment-container.new .comment-content'));

		if (comment.media !== null) {
			var img = '<a href="' + comment.media + '" target="_blank"><img class="comment-thumb" src="' + comment.media + '"></a>';
			$('.comment-container.new .comment-content').append(img);
		}

		$('.comment-youtube').off().on('click', function() {
			resetYoutube();
			$(this).attr('data-playing', true);
			var iId = $(this).find(".preview").attr("data-video_id");
			var html = $(this).html();
			$(this).html('<iframe src="https://www.youtube.com/embed/' + iId + '?autoplay=1" frameborder="0" allowfullscreen></iframe>').append('<div class="youtube_wrapper" style="display:none">' + html + '</div>');
		});

		// Get toxicity data and display on comment
		get_toxicity(comment.comment).then(data => {
			if (data != 'undefined') {
			this.score = data.attributeScores.TOXICITY.summaryScore.value;

			var toxicityColor = 'neutral';
			if (this.score > 0.75) {
				toxicityColor = 'bad';
			} else if (this.score < 0.25) {
				toxicityColor = 'good';
			}

			var toxicity = Math.round(this.score * 100);
			$('.comment-toxicity').text('Toxicity ' + toxicity + '%');
			$('.comment-toxicity').removeClass('good neutral bad').addClass(toxicityColor);

			send_comment_cd(comment.id, comment, iDiscussionId, toxicity);
		}
	}).catch(error => { $('.comment-toxicity').remove(); })

	} else if (aComments.length == 0){
		router.navigate('', false);
	}
	gtm_fire_pageEvent();
	return index;
};

var add_comment = function(commentItem){
	var html = '';
	html += '<div class="comment-container '+commentItem.commentType+'">';
	html += '<div class="comment-meta">';
	html += '<div class="comment-user">'+commentItem.User.username+'</div>';
	html += '<div class="comment-timestamp">'+parseDate(commentItem.date)+'</div>';
	html += '</div>';
	html += '<div class="comment-content">'+$.nl2br(commentItem.comment)+'</div>';
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
}).catch(error => { deactivateTouch($('.comment-container.new')); })
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
}).catch(error => { deactivateTouch($('.comment-container.new')); })
};

var get_comment_id = function(){
	return $('.comment-container.new').data('comment-id');
};

var get_comment_index = function(commentId){
	var index = aComments.findIndex(function(element){ return element.id == commentId; });
	return index;
};

var convert_youtube_links = function($el){
	$el.find('a').each(function(){
		var sLink = $(this).attr('href');
		var match = sLink.match(/(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/g);
		var youtube = '<div class="comment-youtube"> '+
			'<div class="preview" data-video_id="' + getYoutubeId(sLink) + '" style="background-image: url(https://img.youtube.com/vi/' + getYoutubeId(sLink) + '/0.jpg)">'+
			'</div><img class="arrow" src="/media/img/main/arrows/arrow_video_play.png" alt="Play Icon"></div>';

		if (match) {
			$(this).replaceWith(youtube);
		}
	});
};

function getYoutubeId(url){
	var ID = '';
	url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	if(url[2] !== undefined) {
		ID = url[2].split(/[^0-9a-z_\-]/i);
		ID = ID[0];
	}
	else {
		ID = url;
	}
	return ID;
}

function resetYoutube() {
	$('.comment-youtube[data-playing="true"]').each(function(index) {
		$(this).find('iframe').remove();
		$(this).removeAttr('data-playing');
		var preview = $(this).find('.youtube_wrapper').html();
		$(this).html(preview);
		$(this).find('.youtube_wrapper').remove();
	});
};
