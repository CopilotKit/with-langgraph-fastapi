import { Observable } from "rxjs";
import {
  AbstractAgent,
  type AgentConfig,
  type AgentSubscriber,
  type RunAgentParameters,
  type RunAgentResult,
} from "@ag-ui/client";
import { type RunAgentInput, type BaseEvent } from "@ag-ui/core";

export interface WebSocketAgentConfig extends AgentConfig {
  url: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

interface RunWebSocketAgentConfig extends RunAgentParameters {
  abortController?: AbortController;
}

export class WebSocketAgent extends AbstractAgent {
  public url: string;
  public reconnectAttempts: number;
  public reconnectDelay: number;
  private ws: WebSocket | null = null;
  private abortController: AbortController = new AbortController();

  constructor(config: WebSocketAgentConfig) {
    super(config);
    this.url = config.url;
    this.reconnectAttempts = config.reconnectAttempts ?? 3;
    this.reconnectDelay = config.reconnectDelay ?? 1000;
  }

  public runAgent(
    parameters?: RunWebSocketAgentConfig,
    subscriber?: AgentSubscriber
  ): Promise<RunAgentResult> {
    this.abortController = parameters?.abortController ?? new AbortController();
    return super.runAgent(parameters, subscriber);
  }

  abortRun() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.abortController.abort();
    super.abortRun();
  }

  protected run(input: RunAgentInput): Observable<BaseEvent> {
    return new Observable<BaseEvent>((observer) => {
      let reconnectCount = 0;
      let isManualClose = false;

      const connect = () => {
        // Convert http/https URLs to ws/wss
        const wsUrl = this.url.replace(/^http/, "ws");

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log(`WebSocket connected to ${wsUrl}`);
          reconnectCount = 0;

          // Send the input data once connected
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(input));
          }
        };

        this.ws.onmessage = (event) => {
          try {
            // Parse the event data
            const data = event.data;

            // Handle Server-Sent Events format
            if (typeof data === "string" && data.startsWith("data: ")) {
              const jsonData = data.substring(6); // Remove "data: " prefix
              const parsedEvent = JSON.parse(jsonData);
              observer.next(parsedEvent);
            } else {
              // Handle regular JSON
              const parsedEvent = JSON.parse(data);
              observer.next(parsedEvent);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
            observer.error(error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          observer.error(error);
        };

        this.ws.onclose = (event) => {
          console.log(`WebSocket closed: ${event.code} ${event.reason}`);

          if (!isManualClose && reconnectCount < this.reconnectAttempts) {
            reconnectCount++;
            console.log(
              `Attempting to reconnect (${reconnectCount}/${this.reconnectAttempts})...`
            );
            setTimeout(connect, this.reconnectDelay);
          } else if (!isManualClose) {
            observer.error(
              new Error(
                `WebSocket connection failed after ${this.reconnectAttempts} attempts`
              )
            );
          } else {
            observer.complete();
          }
        };
      };

      // Start the connection
      connect();

      // Cleanup function
      return () => {
        isManualClose = true;
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }
      };
    });
  }

  clone(): WebSocketAgent {
    return new WebSocketAgent({
      agentId: this.agentId,
      description: this.description,
      threadId: this.threadId,
      initialMessages: this.messages,
      initialState: this.state,
      debug: this.debug,
      url: this.url,
      reconnectAttempts: this.reconnectAttempts,
      reconnectDelay: this.reconnectDelay,
    });
  }
}
