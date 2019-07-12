


const service = {
    trail:[],
}




///////////////////////////////////


var $router;



///////////////////////////////////

service.reset = function() {
    service.trail = [];
}


///////////////////////////////////

service.backTo = function(state) {

    var index = service.trail.indexOf(state);
    if(index != -1) {
        service.trail.length = index;
        console.log('Back to', state);
        $router.push(getBasic(state));
        return;
    }
}

///////////////////////////////////


service.back = function() {



    // var count = controller.trail.length;
    // var previousState = controller.trail[count - 2];


    // //If we have a state to go back to
    // if (previousState) {
    //     //Go to the previous state
    //     $state.go(previousState.name, previousState.params);
    // } else {
    //     //Go up a level if we can
    //     if ($state.$current.parent && $state.$current.parent.self.name.length) {
    //         $state.go('^');
    //     } else {
    //         //Otherwise just go to the top state
    //         $state.go(controller.topState);
    //     }
    // }


    if(!service.trail.length) {
        return;
    }

    var lastState = service.trail[service.trail.length-2];//.pop();
    service.backTo(lastState);
    // $router.push(getBasic(lastState));
}

///////////////////////////////////

service.init = function(router) {

    $router = router;

    //////////////////////////////////////////////////

    $router.afterEach((to, from) => {
        
        if (to.meta) {
            if(to.meta.resetHistory) {
                service.reset();
            }
        }

        // //////////////////////////////////////////////////

        var thisState = to;
        var previousState = service.trail[service.trail.length-1];
        var match;

        /////////////////////////////////////////////////////
        if(previousState) {


            //Check if it's the same route
            var sameState = thisState.name === previousState.name;
            var sameParams =  _.isEqual(thisState.params, previousState.params);

            //If its the same state just with a different ?query string
            match = (sameState && sameParams);
        }

        //If its not the same route
        if(!match) {
            service.trail.push(to);
            console.log('Router History', service.trail);
        }
    })
}




///////////////////////////////////

function compare(obj1, obj2) {
    if(!obj1) {
        return;
    }

    if(!obj2) {
        return;
    }

    //Loop through properties in object 1
    for (var p in obj1) {
        //Check property exists on both objects
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
        switch (typeof (obj1[p])) {
            //Deep compare objects
            case 'object':
                if (!compare(obj1[p], obj2[p])) return false;
                break;
            //Compare function code
            case 'function':
                if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                break;
            //Compare values
            default:
                if (obj1[p] != obj2[p]) return false;
        }
    }
 
    //Check object 2 for any extra properties
    for (var p in obj2) {
        if (typeof (obj1[p]) == 'undefined') return false;
    }
    return true;
};

///////////////////////////////////

function getBasic(state) {
    if(!state) {
        return;
    }

    return {name:state.name, params:state.params, query:state.query};
}



///////////////////////////////////

export default service;

