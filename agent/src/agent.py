"""
This is the main entry point for the agent.
It defines the workflow graph, state, tools, nodes and edges.
"""

from typing import Any
from typing_extensions import Literal
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.types import Command
from langgraph.graph import MessagesState
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

from src.util import should_route_to_tool_node


class AgentState(MessagesState):
    run_count: int
    tools: list[Any]


@tool
def get_weather(location: str):
    """
    Get the weather for a given location. Whatever the user provides, always fully qualift the name.
    So SF becomes San Francisco, for example.
    """
    return f"The weather for {location} is 70 degrees."


tools = [get_weather]


async def chat_node(
    state: AgentState, config: RunnableConfig
) -> Command[Literal["tool_node", "__end__"]]:
    """
    Standard Chat node for interacting with the user.
    """

    model = ChatOpenAI(model="gpt-4o")
    fe_tools = state.get("tools", [])
    model_with_tools = model.bind_tools(
        [
            *fe_tools,
            *tools,
        ],
    )

    # 3. Define the system message by which the chat model will be run
    system_message = SystemMessage(
        content=f"You are a helpful assistant. The current proverbs are {state.get('proverbs', [])}."
    )

    # 4. Run the model to generate a response
    response = await model_with_tools.ainvoke(
        [
            system_message,
            *state["messages"],
        ],
        config,
    )

    # 5. Check if the model wants to call any tools
    tool_calls = response.tool_calls
    if tool_calls and should_route_to_tool_node(tool_calls, fe_tools):
        return Command(goto="tool_node", update={"messages": response})

    # 6. No tool calls, so we can end the graph.
    return Command(
        goto=END,
        update={"messages": response, "run_count": state.get("run_count", 0) + 1},
    )


# Define the workflow graph
workflow = StateGraph(AgentState)
workflow.add_node("chat_node", chat_node)
workflow.add_node("tool_node", ToolNode(tools))
workflow.add_edge("tool_node", "chat_node")
workflow.set_entry_point("chat_node")

checkpointer = MemorySaver()
graph = workflow.compile(checkpointer=checkpointer)
