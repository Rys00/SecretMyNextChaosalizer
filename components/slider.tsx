import { useEffect } from "react";
import "./slider.css"

let getFunctionVariables: CallableFunction;

const Slider = ( {props: {changeFunction, labels, changeSystemFunction, systemVariablesFunction}}: any) =>{
    getFunctionVariables = systemVariablesFunction;
    let inputs: Array<HTMLInputElement> = [];
    let noSliders = labels.length;

    function addSliders(element: HTMLElement){
        let data = systemVariablesFunction();
        let systemName = data[0];
        let systemVariables = data[1];
        let child: HTMLElement;
        while(element.children.length){
            element.removeChild(element.children[0]);
        }

        inputs = [];

        let trow = document.createElement("tr");
        trow.id = "slider-system-name";
        element.appendChild(trow);
        trow.innerHTML = `<td colspan="2">${systemName} system</td>`;

        for(let i = 0; i<noSliders; i++){
            let trow = document.createElement("tr");
            element.appendChild(trow);
            let tdat = document.createElement("td");
            tdat.className="change-data-inner-td";
            trow.appendChild(tdat);
            let label = document.createElement("label");
            label.innerHTML = labels[i]+" : ";
            tdat.appendChild(label);

            tdat = document.createElement("td");
            tdat.className="change-data-inner-td";
            trow.appendChild(tdat);
            let newChild = document.createElement("input");
            newChild.type = "number";
            newChild.className = "slider-input-class"
            newChild.placeholder = systemVariables[i];
            inputs.push(newChild);
            tdat.appendChild(newChild);
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
        //showSystemData();
    }

    function showSystemData(){
        let data = systemVariablesFunction();
        let element = document.getElementById("slider-info-inner-data");
        if(element == null) return;
        let htmlValue = "";
        for(let i = 0; i<data[0].length; i++){
            htmlValue += data[1][i] + ": "+data[0][i] + "</br>"; 
        }
        element.innerHTML = htmlValue;
    }

    useEffect(() =>{
        const element = document.getElementById("slider-input-places-12334");
        if(element == null) throw("big big error");
        addSliders(element);
        //showSystemData();
    });

    return(<div className="slider-class">
        <center>
        <table>
            <tbody>
                <tr>
                    <td>
                        <table id="slider-input-places-12334"></table>
                        <button onClick={ (event) => runChangeFunction(event) }>simulate</button>
                        <button onClick={changeSystem} className="change-system-button-class">change system</button>
                    </td>
                    <td id="slider-info-inner-data"></td>
                </tr>
            </tbody>
        </table>
        </center>
    </div>);
};

export default Slider;