from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Optional
import json

from ag_ui.core.types import RunAgentInput
from ag_ui.encoder import EventEncoder

class LangGraphAgent:
    """Placeholder for the LangGraph agent."""
    def __init__(self, name: str, description: str = "", graph=None):
        self.name = name
        self.description = description
        self.graph = graph

    async def run(self, input_data: RunAgentInput):
        """Run the agent and yield events."""
        # This will be implemented by the actual LangGraph agent
        pass


def add_langgraph_fastapi_endpoint_websocket(app: FastAPI, agent: LangGraphAgent, path: str = "/"):
    """Adds a WebSocket endpoint to the FastAPI app."""

    @app.websocket(path)
    async def langgraph_agent_websocket(websocket: WebSocket):
        await websocket.accept()

        try:
            while True:
                # Receive input data from the client
                data = await websocket.receive_text()
                input_data = RunAgentInput.model_validate_json(data)

                # Create an event encoder
                encoder = EventEncoder(accept="text/event-stream")

                # Stream events back to the client
                async for event in agent.run(input_data):
                    encoded_event = encoder.encode(event)
                    await websocket.send_text(encoded_event)

        except WebSocketDisconnect:
            print(f"WebSocket disconnected for agent: {agent.name}")
        except Exception as e:
            print(f"Error in WebSocket connection: {e}")
            await websocket.close(code=1011, reason=str(e))

    @app.get(f"{path}/health")
    def health():
        """Health check."""
        return {
            "status": "ok",
            "agent": {
                "name": agent.name,
            }
        }

    @app.get(path)
    async def hello_world_http():
        """Simple HTTP endpoint for testing."""
        return {
            "message": "Hello World! WebSocket endpoint available at ws://...",
            "agent": agent.name
        }
