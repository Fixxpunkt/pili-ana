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
        dataLayer.push(eventParams)

			},
      addToDataLayer: function(key, value) {
        var cd = {};
        cd[key] = value;
        dataLayer.push(cd)
			},
    }
})();


var isMobileDevice = (function() {
  var ua = navigator.userAgent.toLowerCase();
  var platform = 'site-mobile';

  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
    platform = 'site-tablet';
  } else {
    if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua)) {
      platform = 'site-mobile';
    }  else {
      platform = 'site-web';
    }
  }
  GTM.addToDataLayer('platform', platform);
})();

var pageCanonical = (function() {
  var url = window.location.href;
  GTM.addToDataLayer('pageCanonical', url);
})();

var send_comment_cd = function(commentId, comment, discussionId) {
  var date = new Date(comment.date),
			year = date.getFullYear(),
			month = (date.getMonth() < 10 ? '0' : '') + date.getMonth(),
			day = (date.getDate() < 10 ? '0' : '') + date.getDate(),
			hours = (date.getHours() < 10 ? '0': '') + date.getHours(),
			minutes = (date.getMinutes() < 10 ? '0': '') + date.getMinutes(),
			commentDate = year + '' + month + '' + day,
			commentTime = hours + ':' + minutes;

	GTM.addToDataLayer('commentDate', commentDate);
	GTM.addToDataLayer('commentTime', commentTime);

  var commentMedia = (comment.media !== null) ? 'Yes' : 'No';
  GTM.addToDataLayer('commentMedia', commentMedia);

  var commentParent = 'Yes';
  if (comment.commentType == 'child'){
    commentParent = 'No';
  }
  GTM.addToDataLayer('commentParent', commentParent);

  GTM.addToDataLayer('commentId', commentId);
  GTM.addToDataLayer('commentUser', comment.User);
  GTM.addToDataLayer('commentStoryId', discussionId);
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
  GTM.event('Comment', 'Reply', 'Select');
}
var gtm_reply_event = function() {
  GTM.event('Comment', 'Reply', 'Send');
}
