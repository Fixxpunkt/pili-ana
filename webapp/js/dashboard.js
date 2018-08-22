(function () {

	console.log('DASHBOARD INIT');

	var $frame = $('.discussionSlider');
	var $wrap  = $frame.parent();
	var author_id = 592727968;

	fetch(config.api.overview)
		.then(response => response.json())
		.then(data => {
			console.log(data);
			for (item of data.items.Discussions){
				console.log(item);
				var flagColor = 'green';
				if (author_id in item.authors) {
					flagColor = 'magenta';
				}

				var itemHMTL = '';
				itemHMTL += '<li>';
				itemHMTL += '<a href="/comment?id='+item.id+'" class="discussion-item" data-id="'+item.id+'">';
				itemHMTL += '<div class="dashboardCounter"></div>';
				itemHMTL += ' <div class="dashboardTitle">'+item.title+'</div>';
				itemHMTL += '<div class="dashboardMeta">';
				itemHMTL += '<div class="dashboardTimestamp">'+item.date+'</div>';

				if (Object.keys(item.authors).length > 1){
					itemHMTL += '<div class="dashboardAuthor">'+item.authors[Object.keys(item.authors)[0]]+', ...</div>';
				} else {
					itemHMTL += '<div class="dashboardAuthor">'+item.authors[Object.keys(item.authors)[0]]+'</div>';
				}

				itemHMTL += '</div>';
				itemHMTL += '<div class="dashboardFlag '+flagColor+'">';
				itemHMTL += '<div class="flagBox">'+item.waiting_count+'/'+item.total_count+'</div>';
				itemHMTL += '<div class="flagCorner"></div>';
				itemHMTL += '</div>';
				itemHMTL += '</a>';
				itemHMTL += '</li>';

				if (author_id in item.authors) {
					$('#ownStorys .slider').append(itemHMTL);
				} else {
					$('#allStorys .slider').append(itemHMTL);
				}
			}
		})
		.then(done => {
			// Call Sly on frame
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
		});

}());
