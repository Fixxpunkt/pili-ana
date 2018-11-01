window.dataLayer = window.dataLayer || [];
var GTM = (function () {
	var gtmCookie = 'gtm_events';
	return {

		/**
		 * pushes a gtm event to the dataLayer
		 * @param category
		 * @param actions
		 * @param label
		 * @param nonInteraction
		 * @param event
		 * @param {object} customDimension
		 */
		event: function(category, action, label, nonInteraction, customDimension, event) {

			nonInteraction = nonInteraction || false;
			customDimension = customDimension || null;
			event = event || 'gaEvent';

			var eventParams = {
				'event': event,
				'eventCategory': category,
				'eventAction': action,
				'eventLabel': label,
				'eventValue': null,
				'nonInteraction': nonInteraction
			};

			for (var key in customDimension) {
				if (customDimension.hasOwnProperty(key)) eventParams[key] = customDimension[key];
			}

			if (typeof parent.window.dataLayer === 'undefined' || typeof window.dataLayer === 'undefined') {
				return;
			}
			window.dataLayer.push(eventParams)
		}
	}
})();


var platform = (function() {
	var ua = navigator.userAgent.toLowerCase();

	if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
		return 'site-tablet';
	} else {
		if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua)) {
			return 'site-mobile';
		}  else {
			return 'site-web';
		}
	}
})();

var pageUrl = (function() {
	return window.location.href;
})();

var send_basic_cd = function() {
	var pageType = $('div#index').data('type');
	var cd = {
		'platform': platform,
		'pageType': pageType,
		'pageCanonical': pageUrl
	}
	dataLayer.push(cd);
}

var send_comment_cd = function(commentId, comment, discussionId, toxicity) {
	var date = new Date(comment.date),
		year = date.getFullYear(),
		month = (date.getMonth() < 10 ? '0' : '') + date.getMonth(),
		day = (date.getDate() < 10 ? '0' : '') + date.getDate(),
		hours = (date.getHours() < 10 ? '0': '') + date.getHours(),
		minutes = (date.getMinutes() < 10 ? '0': '') + date.getMinutes(),
		commentDate = year + '' + month + '' + day,
		commentTime = hours + ':' + minutes;

	var commentMedia = (comment.media !== null) ? 'Yes' : 'No';
	var commentParent = 'Yes';
	if (comment.commentType == 'child'){
		commentParent = 'No';
	}
	var pageType = $('div#index').data('type');

	var cd = {
		'platform': platform,
		'pageType': pageType,
		'pageCanonical': pageUrl,
		'commentDate': commentDate,
		'commentTime' : commentTime,
		'commentMedia': commentMedia,
		'commentParent': commentParent,
		'commentId': commentId,
		'commentUser': comment.User.username,
		'approvedComments': comment.User.cleared,
		'approvedCommentsRatio': comment.User.quote,
		'commentStoryId': discussionId,
		'commentToxicLevel': toxicity
	};
	dataLayer.push(cd);
};

var gtm_skip_event = function() {
	GTM.event('Interactions', 'Navigation', 'Skip');
}
var gtm_back_event = function() {
	GTM.event('Interactions', 'Navigation', 'Back');
}
var gtm_approve_btn_event = function() {
	GTM.event('Comments', 'Approve', 'Button');
}
var gtm_approve_swipe_event = function() {
	GTM.event('Comments', 'Approve', 'Swipe');
}
var gtm_decline_btn_event = function() {
	GTM.event('Comments', 'Decline', 'Button');
}
var gtm_decline_swipe_event = function() {
	GTM.event('Comments', 'Decline', 'Swipe');
}
var gtm_reply_btn_event = function() {
	GTM.event('Comments', 'Reply', 'Select');
}
var gtm_reply_event = function() {
	GTM.event('Comments', 'Reply', 'Send');
}
var gtm_discussion_event = function() {
	GTM.event('Comments', 'Discussion', 'Show');
}
var gtm_fire_pageEvent = function() {
	window.dataLayer.push({
		'event': 'gapageEvent'
	});
}
