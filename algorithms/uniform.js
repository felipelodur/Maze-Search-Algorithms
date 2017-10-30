//Compare function to order by g(n)
function compare(a,b) {
  if (a.g < b.g)
     return -1;
  if (a.g > b.g)
    return 1;
  return 0;
}

function Uniform(map, start, end, allowDiagonals) {
    this.map = map;
    this.lastCheckedNode = start;
    this.openSet = [];
    this.openSet.push(start); //start with beginning node
    this.closedSet = [];
    this.start = start;
    this.end = end;
    this.allowDiagonals = allowDiagonals;


    this.visualDist = function(a, b) {
        return dist(a.i, a.j, b.i, b.j);
    }

    this.heuristic = function(a, b) {
        var d;
        if (allowDiagonals) {
            d = dist(a.i, a.j, b.i, b.j);
        } else {
            d = abs(a.i - b.i) + abs(a.j - b.j);
        }
        return d;
    }

    this.removeFromArray = function(arr, elt) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == elt) {
                arr.splice(i, 1);
            }
        }
    }

    //returns 0 if search ongoing
    //returns 1 if goal reached
    //returns -1 if no solution
    this.step = function() {

        if (this.openSet.length > 0) {

            var winner = 0; //always first for Uniform
            var current = this.openSet[winner];
            this.lastCheckedNode = current;

            if (current === this.end) {
                return 1;
            }

            // Best option moves from openSet to closedSet
            this.removeFromArray(this.openSet, current);
            this.closedSet.push(current);

            // Check all the neighbors
            var orderedSet = []
            var neighbors = current.getNeighbors();
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                // Valid next spot?
                if (!this.closedSet.includes(neighbor)) {
                    // Is this a better path than before?
                    var tempG = current.g;

                    // Is this a better path than before?
                    if (!this.openSet.includes(neighbor)) {
                        this.openSet.push(neighbor);
                    } else if (tempG >= neighbor.g) {
                        // No, it's not a better path
                        continue;
                    }

                    neighbor.g = tempG;
                    if (!allowDiagonals) {
                        neighbor.vh = this.visualDist(neighbor, end);
                    }
                    neighbor.previous = current;
                }

                this.openSet.sort(compare);

            }
            return 0;
        } else {
            return -1;
        }
    }

}