
function DFS(map, start, end, allowDiagonals) {
    this.map = map;
    this.lastCheckedNode = start;
    this.openSet = [];
    this.openSet.push(start);
    this.closedSet = [];
    this.start = start;
    this.end = end;
    this.allowDiagonals = allowDiagonals;


    this.visualDist = function(a, b) {
        return dist(a.i, a.j, b.i, b.j);
    }

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
            var winner = 0;
            for (var i = 1; i < this.openSet.length; i++) {
                if (this.openSet[i].f < this.openSet[winner].f) {
                    winner = i;
                }
                if (this.openSet[i].f == this.openSet[winner].f) {
                    if (this.openSet[i].g > this.openSet[winner].g) {
                        winner = i;
                    }
                    if (!this.allowDiagonals) {
                        if (this.openSet[i].g == this.openSet[winner].g &&
                            this.openSet[i].vh < this.openSet[winner].vh) {
                            winner = i;
                        }
                    }
                }
            }
            var current = this.openSet[this.openSet.length - 1];
            this.lastCheckedNode = current;

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
                    var tempG = current.g;

                    if (!this.openSet.includes(neighbor)) {
                        this.openSet.push(neighbor);
                    } else if (tempG >= neighbor.g) {
                        continue;
                    }

                    neighbor.g = tempG;
                    if (!allowDiagonals) {
                        neighbor.vh = this.visualDist(neighbor, end);
                    }
                    neighbor.f = neighbor.g;
                    neighbor.previous = current;
                }

            }
            return 0;
        } else {
            return -1;
        }
    }
}
