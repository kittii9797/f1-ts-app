import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useFlip, FlipProvider } from "react-easy-flip";
import  React,{useState, useEffect} from "react";
import "./App.css"

const map = "drivers/";
const filetype =".png";
const flagimg ="https://countryflagsapi.com/png/"

const shuffle = function shuffle(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
	  let j = Math.floor(Math.random() * (i + 1));
	  [array[i], array[j]] = [array[j], array[i]];
	}
	return array;
  };
  
	export interface Racer {
	  id: string,
	  code: string,
	  firstname: string,
	  lastname: string,
	  country: string,
	  team: string,
	  [key: string]: any;
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
	padding: 20,
	background: isDragging ? "#4a2975" : "linear-gradient(90deg, black, rgb(95 58 58))",
	color: isDragging ? "white" : "black",
	border: `1px solid black`,
	fontSize: `20px`,
	borderRadius: `5px`,

	...draggableStyle
})

function App() {
	const [drivers, setDrivers] = useState<Racer[]>([]);

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result
		if (!destination) return

		const items = Array.from(drivers)
		const [ newOrder ] = items.splice(source.index, 1)
		items.splice(destination.index, 0, newOrder)

		setDrivers(items)
	}


  const CombinedArray = drivers.map((item, index) => ({ 
    place: index + 1, 
    id: item.id,
    code: item.code, 
    firstname: item.firstname, 
    lastname: item.lastname, 
    team: item.team ,
    country: item.country,
    img: map + item.code + filetype,
    }));

    const result = CombinedArray.sort((a, b) => (a.place > b.place) ? 1 : -1);

    const indexPlus = 1;

    console.log(result)


  useEffect(() =>{
    fetch("/drivers.json")
    .then(resp => resp.json())
    .then((data: Racer[] )=> setDrivers(data))
    }, []);


  const todoItemsId = "flip-todo-items";

  useFlip(todoItemsId, {
    duration: 800,
  });
  
	return (
		<div className="App">
			<div className="head-section"><h1>Formula 1 App</h1></div>
			<FlipProvider>
			<button
				className="mt-2 p-2 bg-gray-200 font-bold rounded-lg hover:bg-gray-400 button"
				onClick={() =>  setDrivers(shuffle([...drivers]))}
				>
				<span>Random Race Start</span>
            </button>
			<div className="race-section">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="drivers">
					{(provided) => (
						<div className="drivers" {...provided.droppableProps} ref={provided.innerRef} data-flip-root-id={todoItemsId}>
							{drivers.map(({ id, firstname, lastname, country,team,code }, index) => {
								return (
									<Draggable key={id} draggableId={id} index={index}>
										{(provided, snapshot) => (
											<div className="race-inner"
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
												data-flip-id={`flip-id-${id}`}
											>
												<div className="race-place">{index + indexPlus}</div>

												<hr/>

												<img className="racer" src={map + code.toLowerCase() + filetype} alt="racer" />

												<div className="info-racer title">
												{firstname}<br/>
												{lastname}
												</div>

												<div className="info-racer des">
													<img className="racer flag" src={flagimg + country.toLowerCase()} alt="racer" /><br/>
													{team}
												</div>

											</div>
										)}
									</Draggable>
								)
							})}
						</div>
					)}
				</Droppable>
				</DragDropContext>
				</div>
			</FlipProvider>
		</div>
	)
}

export default App
