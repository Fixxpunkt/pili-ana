(function () {
	// Load all discussions and init dashboard
	get_discussions().then(data => {initDashboard(data)})
}());

var initDashboard = function(objDiscussions){
	for (discussionItem of objDiscussions.items.Discussions){
		var flagColor = author_id in discussionItem.authors ? 'magenta' : 'green';
		var authorCut = Object.keys(discussionItem.authors).length > 1 ? ', ...' : '';
		var dashboardHMTL = '';

		dashboardHMTL += '<li>';
		dashboardHMTL += '<a href="/comment?id='+discussionItem.id+'" class="discussion-item" data-id="'+discussionItem.id+'">';
		dashboardHMTL += '<div class="dashboard-counter"></div>';
		dashboardHMTL += '<div class="dashboard-title">'+discussionItem.title+'</div>';
		dashboardHMTL += '<div class="dashboard-meta">';
		dashboardHMTL += '<div class="dashboard-timestamp">'+discussionItem.date+'</div>';
		dashboardHMTL += '<div class="dashboard-author">'+discussionItem.authors[Object.keys(discussionItem.authors)[0]]+authorCut+'</div>';
		dashboardHMTL += '</div>';
		dashboardHMTL += '<div class="dashboard-flag '+flagColor+'">';
		dashboardHMTL += '<div class="flag-box">'+discussionItem.waiting_count+'/'+discussionItem.total_count+'</div>';
		dashboardHMTL += '<div class="flag-corner"></div>';
		dashboardHMTL += '</div>';
		dashboardHMTL += '</a>';
		dashboardHMTL += '</li>';

		if (author_id in discussionItem.authors) {
			$('#ownstorys .slider').append(dashboardHMTL);
		} else {
			$('#allstorys .slider').append(dashboardHMTL);
		}
	}

	var $frame = $('.discussion-slider');
	var $wrap  = $frame.parent();

	$frame.sly({
		horizontal: 1,
		itemNav: 'forceCentered',
		smart: 1,
		activateMiddle: 1,
		activateOn: 'click',
		mouseDragging: 1,
		touchDragging: 1,
		releaseSwing: 1,
		startAt: 0,
		scrollBy: 1,
		speed: 300,
		elasticBounds: 1,
		easing: 'easeOutExpo',
		dragHandle: 1,
		dynamicHandle: 1,
		clickBar: 1,

		// Buttons
		prev: $wrap.find('.prev'),
		next: $wrap.find('.next')
	});
};
