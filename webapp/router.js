// asyncrhonously fetch the html template partial from the file directory,
// then set its contents to the html of the parent element
function loadHTML(url, view) {
  req = new XMLHttpRequest();
  req.open('GET', url);
  req.send();
  
  req.onload = () => {
    $('.'+view).empty();
    $('.'+view).append(req.responseText);
  };
}

router = new Navigo();
router.on({
	'/comment': (params, query) => {
		loadHTML('view/comment.html', 'view');
	},
	'/reply': (params, query) => {
		loadHTML('view/reply.html', 'view');
	},
	'*': function () {
		loadHTML('view/dashboard.html', 'view');
	}
}).resolve();

// set the 404 route
router.notFound((query) => { $id('view').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>'; });

