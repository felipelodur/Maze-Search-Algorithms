function BFS(map, start, end, allowDiagonals) {
	this.map = map;
    this.lastCheckedNode = start;
    this.openSet = [];
    this.openSet.push(start); //starts with beginning node
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

            // Next option - In the BFS, always the first of the level.
            var winner = 0;
            var current = this.openSet[winner];
            this.lastCheckedNode = current;

            if (current === this.end) {
                return 1;
            }

            this.removeFromArray(this.openSet, current);
            this.closedSet.push(current);

            var neighbors = current.getNeighbors();
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                // Valid next spot?
                if (!this.closedSet.includes(neighbor)) {
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