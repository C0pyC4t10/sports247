function createCircle(radius) {
    return {
        radius: radius,
        draw: function() {
            console.log('draw');
        }
    }
};
const circle= createCircle(1);
circle.draw();

function Circle(radius) {
    this.radius= radius; 
    this.draw= function() {
        console.log('draw');
    }
}
const another = new Circle(1);
another.draw();

let number= 10;
function increase(number) {
    number++;
}
increase(number);
console.log(number);