function BFS(map, start, end, allowDiagonals) {
	this.map = map;
    this.lastCheckedNode = start;
    this.openSet = [];
    // openSet starts with beginning node only
    this.openSet.push(start);
    this.closedSet = [];
    this.start = start;
    this.end = end;
    this.allowDiagonals = allowDiagonals;

    //This function returns a measure of aesthetic preference for
    //use when ordering the openSet. It is used to prioritise
    //between equal standard heuristic scores. It can therefore
    //be anything you like without affecting the ability to find
    //a minimum cost path.

    this.visualDist = function(a, b) {
        return dist(a.i, a.j, b.i, b.j);
    }

    // An educated guess of how far it is between two points

    this.heuristic = function(a, b) {
        var d;
        if (allowDiagonals) {
            d = dist(a.i, a.j, b.i, b.j);
        } else {
            d = abs(a.i - b.i) + abs(a.j - b.j);
        }
        return d;
    }

    // Function to delete element from the array
    this.removeFromArray = function(arr, elt) {
        // Could use indexOf here instead to be more efficient
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == elt) {
                arr.splice(i, 1);
            }
        }
    }

    //Run one finding step.
    //returns 0 if search ongoing
    //returns 1 if goal reached
    //returns -1 if no solution
    this.step = function() {

        if (this.openSet.length > 0) {

            // Next option - In the BFS, always the first of the level.
            var winner = 0;
            var current = this.openSet[winner];
            this.lastCheckedNode = current;

            // Did I finish?
            if (current === this.end) {
                return 1;
            }

            // Best option moves from openSet to closedSet
            this.removeFromArray(this.openSet, current);
            this.closedSet.push(current);

            // Check all the neighbors
            var neighbors = current.getNeighbors();

            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                // Valid next spot?
                if (!this.closedSet.includes(neighbor)) {
                    // Is this a better path than before?
                    this.openSet.push(neighbor);
                    var tempG = current.g + this.heuristic(neighbor, current);
                    neighbor.previous = current;
                }

            }
            return 0;
        } else {
            return -1;
        }
    }

}