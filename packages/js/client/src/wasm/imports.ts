/* eslint-disable @typescript-eslint/naming-convention */

import { u32, W3Imports } from "./types";
import { readBytes, readString, writeBytes, writeString } from "./buffer";
import { Client, InvokableModules } from "..";
import { State } from "./WasmWeb3Api";

import { msgpackEncode } from "@web3api/core-js";

export const createImports = (config: {
  client: Client;
  memory: WebAssembly.Memory;
  state: State;
  abort: (message: string) => never;
}): W3Imports => {
  const { memory, state, client, abort } = config;

  return {
    w3: {
      __w3_subinvoke: async (
        uriPtr: u32,
        uriLen: u32,
        modulePtr: u32,
        moduleLen: u32,
        methodPtr: u32,
        methodLen: u32,
        inputPtr: u32,
        inputLen: u32
      ): Promise<boolean> => {
        // Reset our state
        state.subinvoke.result = undefined;
        state.subinvoke.error = undefined;

        const uri = readString(memory.buffer, uriPtr, uriLen);
        const moduleToInvoke = readString(memory.buffer, modulePtr, moduleLen);
        const method = readString(memory.buffer, methodPtr, methodLen);
        const input = readBytes(memory.buffer, inputPtr, inputLen);

        const { data, error } = await client.invoke<unknown | ArrayBuffer>({
          uri: uri,
          module: moduleToInvoke as InvokableModules,
          method: method,
          input: input,
          noDecode: true,
        });

        if (!error) {
          let msgpack: ArrayBuffer;
          if (data instanceof ArrayBuffer) {
            msgpack = data;
          } else {
            msgpack = msgpackEncode(data);
          }

          state.subinvoke.result = msgpack;
        } else {
          state.subinvoke.error = `${error.name}: ${error.message}`;
        }

        return !error;
      },
      // Give WASM the size of the result
      __w3_subinvoke_result_len: (): u32 => {
        if (!state.subinvoke.result) {
          abort("__w3_subinvoke_result_len: subinvoke.result is not set");
          return 0;
        }
        return state.subinvoke.result.byteLength;
      },
      // Copy the subinvoke result into WASM
      __w3_subinvoke_result: (ptr: u32): void => {
        if (!state.subinvoke.result) {
          abort("__w3_subinvoke_result: subinvoke.result is not set");
          return;
        }
        writeBytes(state.subinvoke.result, memory.buffer, ptr);
      },
      // Give WASM the size of the error
      __w3_subinvoke_error_len: (): u32 => {
        if (!state.subinvoke.error) {
          abort("__w3_subinvoke_error_len: subinvoke.error is not set");
          return 0;
        }
        return state.subinvoke.error.length;
      },
      // Copy the subinvoke error into WASM
      __w3_subinvoke_error: (ptr: u32): void => {
        if (!state.subinvoke.error) {
          abort("__w3_subinvoke_error: subinvoke.error is not set");
          return;
        }
        writeString(state.subinvoke.error, memory.buffer, ptr);
      },
      __w3_subinvokeImplementation: async (
        interfaceUriPtr: u32,
        interfaceUriLen: u32,
        implUriPtr: u32,
        implUriLen: u32,
        modulePtr: u32,
        moduleLen: u32,
        methodPtr: u32,
        methodLen: u32,
        inputPtr: u32,
        inputLen: u32
      ): Promise<boolean> => {
        state.subinvokeImplementation.result = undefined;
        state.subinvokeImplementation.error = undefined;

        // const interfaceUri = readString(
        //   memory.buffer,
        //   interfaceUriPtr,
        //   interfaceUriLen
        // );
        const implUri = readString(memory.buffer, implUriPtr, implUriLen);
        const moduleToInvoke = readString(memory.buffer, modulePtr, moduleLen);
        const method = readString(memory.buffer, methodPtr, methodLen);
        const input = readBytes(memory.buffer, inputPtr, inputLen);

        state.subinvokeImplementation.args = [
          implUri,
          moduleToInvoke as InvokableModules,
          method,
          input,
        ];

        const { data, error } = await client.invoke<unknown | ArrayBuffer>({
          uri: implUri,
          module: moduleToInvoke as InvokableModules,
          method: method,
          input: input,
          noDecode: true,
        });

        if (!error) {
          let msgpack: ArrayBuffer;
          if (data instanceof ArrayBuffer) {
            msgpack = data;
          } else {
            msgpack = msgpackEncode(data);
          }

          state.subinvokeImplementation.result = msgpack;
        } else {
          state.subinvokeImplementation.error = `${error.name}: ${error.message}`;
        }

        return !error;
      },
      __w3_subinvokeImplementation_result_len: (): u32 => {
        if (!state.subinvokeImplementation.result) {
          abort(
            "__w3_subinvokeImplementation_result_len: subinvokeImplementation.result is not set"
          );
          return 0;
        }
        return state.subinvokeImplementation.result.byteLength;
      },
      __w3_subinvokeImplementation_result: (ptr: u32): void => {
        if (!state.subinvokeImplementation.result) {
          abort(
            "__w3_subinvokeImplementation_result: subinvokeImplementation.result is not set"
          );
          return;
        }
        writeBytes(state.subinvokeImplementation.result, memory.buffer, ptr);
      },
      __w3_subinvokeImplementation_error_len: (): u32 => {
        if (!state.subinvokeImplementation.error) {
          abort(
            "__w3_subinvokeImplementation_error_len: subinvokeImplementation.error is not set"
          );
          return 0;
        }
        return state.subinvokeImplementation.error.length;
      },
      __w3_subinvokeImplementation_error: (ptr: u32): void => {
        if (!state.subinvokeImplementation.error) {
          abort(
            "__w3_subinvokeImplementation_error: subinvokeImplementation.error is not set"
          );
          return;
        }
        writeString(state.subinvokeImplementation.error, memory.buffer, ptr);
      },
      // Copy the invocation's method & args into WASM
      __w3_invoke_args: (methodPtr: u32, argsPtr: u32): void => {
        if (!state.method) {
          abort("__w3_invoke_args: method is not set");
          return;
        }
        if (!state.args) {
          abort("__w3_invoke_args: args is not set");
          return;
        }
        writeString(state.method, memory.buffer, methodPtr);
        writeBytes(state.args, memory.buffer, argsPtr);
      },
      // Store the invocation's result
      __w3_invoke_result: (ptr: u32, len: u32): void => {
        state.invoke.result = readBytes(memory.buffer, ptr, len);
      },
      // Store the invocation's error
      __w3_invoke_error: (ptr: u32, len: u32): void => {
        state.invoke.error = readString(memory.buffer, ptr, len);
      },
      __w3_getImplementations: (uriPtr: u32, uriLen: u32): boolean => {
        const uri = readString(memory.buffer, uriPtr, uriLen);
        const result = client.getImplementations(uri, {});
        state.getImplementationsResult = msgpackEncode(result);
        return result.length > 0;
      },
      __w3_getImplementations_result_len: (): u32 => {
        if (!state.getImplementationsResult) {
          abort("__w3_getImplementations_result_len: result is not set");
          return 0;
        }
        return state.getImplementationsResult.byteLength;
      },
      __w3_getImplementations_result: (ptr: u32): void => {
        if (!state.getImplementationsResult) {
          abort("__w3_getImplementations_result: result is not set");
          return;
        }
        writeBytes(state.getImplementationsResult, memory.buffer, ptr);
      },
      __w3_load_env: (ptr: u32): void => {
        if (state.env) {
          writeBytes(state.env, memory.buffer, ptr);
        }
      },
      __w3_sanitize_env_args: (ptr: u32): void => {
        if (!state.sanitizeEnv.args) {
          abort("__w3_sanitize_env: args is not set");
          return;
        }

        writeBytes(state.sanitizeEnv.args, memory.buffer, ptr);
      },
      __w3_sanitize_env_result: (ptr: u32, len: u32): void => {
        state.sanitizeEnv.result = readBytes(memory.buffer, ptr, len);
      },
      __w3_abort: (
        msgPtr: u32,
        msgLen: u32,
        filePtr: u32,
        fileLen: u32,
        line: u32,
        column: u32
      ): void => {
        const msg = readString(memory.buffer, msgPtr, msgLen);
        const file = readString(memory.buffer, filePtr, fileLen);

        abort(
          `__w3_abort: ${msg}\nFile: ${file}\nLocation: [${line},${column}]`
        );
      },
      __w3_debug_log: (ptr: u32, len: u32): void => {
        const msg = readString(memory.buffer, ptr, len);
        console.debug(`__w3_debug_log: ${msg}`);
      },
    },
    env: {
      memory,
    },
  };
};
