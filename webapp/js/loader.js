var loader = document.getElementById('loader').getContext('2d');
var startingPoint = 0; // starting point
var pointToFill = 4;
var width = loader.canvas.width;
var height = loader.canvas.height;
var diff;   // find the different between current value (startingPoint) and trageted value (100)

function fillCounter(element){
	diff = ((startingPoint/100) * Math.PI*2*10);

	loader.clearRect(0,0,width,height);  // initially clear the rectangle
	loader.lineWidth = 4;     // stroke width
	loader.strokeStyle = '#7ED321';    // Stroke Color
	// start drawing
	loader.beginPath();
	loader.arc(35,35,20,pointToFill,diff/2+pointToFill);    //arc(x,y,radius,start,stop)
	loader.stroke();   // fill stroke

	if (startingPoint >= 20) {
		//clearTimeout(this);     //fill is a variable that call the function fillcounter()
		//clearTimeout(fill);
		element.trigger('loaderFinished');
	}
	startingPoint++;
}
//var fill;//=setInterval(fillCounter,50);