 import React from "react";

export default function Progress(props){


    function  move(){
        var prog = document.getElementById("counter");

        let width = Number(props.value);
        console.log(prog);
        prog.style.width = width + "%";

        if (width > 40 || width < 50) {
            return "#021bff";
        }
        if (width > 30 || width < 40) {
            return "#ffff02";
        }
        if (width > 20 || width < 30) {
            return "#e98407";
        }
        if (width < 10) {
            return"#db1010";
        }


    }


    return(
        <div className="form-group">
             <div  id="myBar"  style={{width: props.value+"%", bacground:'#736947'}}>
                 {props.value}

                </div>
        </div>


    );




}

