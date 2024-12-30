import { useEffect } from "react";


const Slider = ( {props: {noSliders, changeFunction, labels, changeSystemFunction}}: any) =>{
    let inputs: Array<HTMLInputElement> = [];

    function addSliders(element: HTMLElement){

        let child: HTMLElement;
            while(element.children.length){
            element.removeChild(element.children[0]);
        }

        inputs = [];

        for(let i = 0; i<noSliders; i++){
            let label = document.createElement("label");
            label.innerHTML = labels[i]+" : ";
            element.appendChild(label);
            let newChild = document.createElement("input");
            newChild.type = "number";
            inputs.push(newChild);
            element.appendChild(newChild);
            let br = document.createElement("br");
            element.appendChild(br);
        }
    }

    function runChangeFunction(event: any){
        let values = [];

        let child: HTMLInputElement;
        for(child of inputs){
            values.push(Number(child.value));
        }

        changeFunction(values);
    }

    function changeSystem(){
        let variables = changeSystemFunction();
        noSliders = variables.length;
        labels = variables;
        const element = document.getElementById("slider-input-places-12334");
        if(element == null) throw("big big error");
        addSliders(element);
    }

    useEffect(() =>{
        const element = document.getElementById("slider-input-places-12334");
        if(element == null) throw("big big error");
        addSliders(element);
    });

    return(<div>
        <button onClick={changeSystem}>change system</button>
        <div id="slider-input-places-12334"></div>
        <button onClick={ (event) => runChangeFunction(event) }>simulate</button>
    </div>);
};

export default Slider;