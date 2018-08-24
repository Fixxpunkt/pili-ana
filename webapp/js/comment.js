
var aAllComments;
var aComments = [];
var discussionId;

(function () {
	console.log('COMMENT INIT');
	let params = (new URL(document.location)).searchParams;
	discussionId = params.get("id");
	console.log(discussionId);

	fetch(config.api.discussion+'?id='+discussionId)
		.then(response => response.json())
		.then(data => {
			console.log(data);

			$('.comment-title').text(data.items.aData.Discussion.title);

			parentItem = data.items.aData.Comments;
			aAllComments = data.items.aData.Comments;
			for (parentKey in parentItem){

				// parents
				parentItem[parentKey].commentType = 'parent';
				if (parentItem[parentKey].status == 0){
					aComments.push(parentItem[parentKey]);
				}

				// children
				if (parentItem[parentKey].children && Object.keys(parentItem[parentKey].children).length > 0){
					childItem = parentItem[parentKey].children;
					for (childKey in childItem){
						childItem[childKey].commentType = 'child';
						childItem[childKey].parentId = parentItem[parentKey].id;
						if (childItem[childKey].status == 0){
							aComments.push(childItem[childKey]);
						}
					}
				}
			}
		})
		.then(done => {
			var iCurrentComment = loadComment(0);

			$('.skip-btn').on('click', function(){
				iCurrentComment = loadComment((iCurrentComment+1));
			});

			$('.show-btn').on('click', function(){
				$('.discussion-container').removeClass('collapsed');
			});

			$('.action-btns, .comment-container.new').css('visibility', 'visible');

			$('.delete-btn').on('click', deleteComment);
			$('.approve-btn').on('click', approveComment);
			$('.reply-btn').on('click', function(){
				window.location = '/reply?id='+getCommentId()+'&dId='+discussionId;
			});
		});
}());

var loadComment = function(index) {
	$('.discussion-container').addClass('collapsed');
	$('.discussion-container').empty();

	if (index < aComments.length) {
		$('.comment-counter').text((index + 1) + '/' + aComments.length);
		$('.progress-bar progress').val(100/aComments.length*(index+1));

		if (aComments[index].commentType == 'child'){
			var parentItem = aAllComments[aComments[index].parentId];
			addComment(parentItem);
			for (key in parentItem.children){
				if (parentItem.children[key].status != 0){
					addComment(parentItem.children[key]);
				}
			}
		}

		$('.comment-container.new').removeClass('parent child');
		$('.comment-container.new').addClass(aComments[index].commentType);
		$('.comment-container.new').data('comment-id', aComments[index].id);
		$('.comment-container.new .comment-user').text(aComments[index].User);
		$('.comment-container.new .comment-timestamp').text(aComments[index].date);
		$('.comment-container.new .comment-content').text(aComments[index].comment);
		getToxicity(aComments[index].comment);
	} else {
		window.location = '/';
	}

	return index;
};

var addComment = function(commentItem){
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

var getToxicity = function(text) {
	this.score = 0;

	// Request
	var objComment = {
		comment: {
			text: text
		},
		languages: ["en"],
		requestedAttributes: {
			TOXICITY: {}
		}
	};

	fetch(config.api.perspective, {
		method: 'POST',
		body: JSON.stringify(objComment),
		headers:{
			'Content-Type': 'application/json'
		}
	}).then(res => res.json())
	.then(data => {
		this.score = data.attributeScores.TOXICITY.summaryScore.value;
	})
	.then(done => {
		$('.comment-toxicity').text('Toxicity '+Math.round(this.score*100)+'%');
		var toxicityColor = 'neutral';
		if (this.score > 0.75){
			toxicityColor = 'bad';
		} else if (this.score < 0.25) {
			toxicityColor = 'good';
		}
		$('.comment-toxicity').removeClass('good neutral bad').addClass(toxicityColor);
	})
	.catch(error => console.error('Error:', error))
};

var getColor = function(value) {
	var hue=((1-value)*120).toString(10);
	return ["hsl(",hue,",100%,50%)"].join("");
};

var deleteComment = function(){
	var commentId = getCommentId();
	var currentIndex = aComments.findIndex(function(element){
		return element.id == commentId;
	});

	fetch(config.api.delete+'?id='+commentId+'&iDiscussionId='+discussionId)
		.then(response => response.json())
		.then(data => {
			if (data.status == 1){
				$('.comment-status, .comment-status .deleted').show().delay(500).fadeOut(200);
				$('.action-btns').hide();
				setTimeout(function() {
					aComments.splice(currentIndex, 1);
					if (currentIndex == aComments.length && aComments.length != 0) {
						currentIndex--;
					}
					loadComment(currentIndex);
					$('.action-btns').show();
				}, 700);
			}
		})
};

var approveComment = function(){
	var commentId = getCommentId();
	var currentIndex = aComments.findIndex(function(element){
		return element.id == commentId;
	});

	fetch(config.api.approve+'?id='+commentId)
		.then(response => response.json())
		.then(data => {
			if (data.status == 1){
				$('.comment-status, .comment-status .approved').show().delay(500).fadeOut(200);
				$('.action-btns').hide();
				setTimeout(function(){
					aComments[currentIndex].status = 1;
					aComments.splice(currentIndex, 1);
					if (currentIndex == aComments.length && aComments.length != 0){
						currentIndex --;
					}
					loadComment(currentIndex);
					$('.action-btns').show();
				}, 700);
			}
		})
};

var respondComment = function(){
	/*var commentId = $('.comment-container.new').data('comment-id');
	var currentIndex = aComments.findIndex(function(element){
		return element.id == commentId;
	});
	var commentItem = aComments.find(function(element){
		return element.id == commentId;
	});

	fetch(config.api.respond+'?id='+commentId+'&iDiscussionId='+discussionId+'&comment='+commentItem.comment)
		.then(response => response.json())
		.then(data => {
			console.log(data);
		})*/
};

var getCommentId = function(){
	return $('.comment-container.new').data('comment-id');
}