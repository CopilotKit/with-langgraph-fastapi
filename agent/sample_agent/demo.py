"""
This serves the "sample_agent" agent. This is an example of self-hosting an agent
through our FastAPI integration. However, you can also host in LangGraph platform.
"""

import os
from dotenv import load_dotenv

from fastapi import FastAPI
import uvicorn
from sample_agent.agent import graph
from ag_ui_langgraph import LangGraphAgent
from sample_agent.websocket_endpoint import add_langgraph_fastapi_endpoint_websocket

_ = load_dotenv()  # pylint: disable=wrong-import-position

app = FastAPI()

add_langgraph_fastapi_endpoint_websocket(
    app=app,
    agent=LangGraphAgent(
        name="sample_agent",
        description="An example agent to use as a starting point for your own agent.",
        graph=graph,
    ),
    path="/",
)


def main():
    """Run the uvicorn server."""
    port = int(os.getenv("PORT", "8123"))
    uvicorn.run(
        "sample_agent.demo:app",
        host="0.0.0.0",
        port=port,
        reload=True,
    )
