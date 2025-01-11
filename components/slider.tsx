import { useEffect } from "react";
import "./slider.css"

type changeFunctionType = (variables:Array<number>) => void;
type functionNoArrayString = () => Array<string | undefined>

interface Props{
    changeFunction: changeFunctionType
    labels: Array<string>
    changeSystemFunction: functionNoArrayString
    systemVariablesFunction: functionNoArrayString
}

const Slider = ( props: Props ) =>{
    let labels = props.labels;
    const changeFunction = props.changeFunction;
    const changeSystemFunction = props.changeSystemFunction;
    const systemVariablesFunction = props.systemVariablesFunction;

    let inputs: Array<HTMLInputElement> = [];
    let noSliders: number = labels.length;

    function addSliders(element: HTMLElement){
        const data = systemVariablesFunction();
        while(element.children.length){
            element.removeChild(element.children[0]);
        }

        inputs = [];

        let trow = document.createElement("tr");
        trow.id = "slider-system-name";
        element.appendChild(trow);
        trow.innerHTML = `<td colspan="2">${data[0]} system</td>`;

        for(let i = 0; i<noSliders; i++){
            trow = document.createElement("tr");
            element.appendChild(trow);

            let tdat = document.createElement("td");
            tdat.className="change-data-inner-td";
            trow.appendChild(tdat);
            const label = document.createElement("label");
            label.innerHTML = labels[i]+" : ";
            tdat.appendChild(label);

            tdat = document.createElement("td");
            tdat.className="change-data-inner-td";
            trow.appendChild(tdat);
            const newChild = document.createElement("input");
            newChild.type = "number";
            newChild.className = "slider-input-class"
            newChild.placeholder = data[i+1] || "error";
            inputs.push(newChild);
            tdat.appendChild(newChild);
        }
    }

    function runChangeFunction(){
        const values = [];

        let child: HTMLInputElement;
        for(child of inputs){
            values.push(Number(child.value));
        }

        changeFunction(values);
    }

    function changeSystem(){
        const variables = changeSystemFunction();
        noSliders = variables.length;
        labels = [];
        for(let i = 0; i<variables.length; i++){
            labels.push(variables[i] || "error");
        }
        const element = document.getElementById("slider-input-places-12334");
        if(element == null) throw("big big error");
        addSliders(element);
    }

    useEffect(() =>{
        const element = document.getElementById("slider-input-places-12334");
        if(element == null) throw("big big error");
        addSliders(element);
    });

    return(<div className="slider-class">
        <center>
        <table>
            <tbody>
                <tr>
                    <td>
                        <table id="slider-input-places-12334"></table>
                        <button onClick={runChangeFunction}>simulate</button>
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