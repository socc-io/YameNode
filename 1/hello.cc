#include <node.h>

namespace demo {
	using v8::Exception;
	using v8::Function;
	using v8::FunctionCallbackInfo;
	using v8::Isolate;
	using v8::Local;
	using v8::Null;
	using v8::Object;
	using v8::String;
	using v8::Value;
	using v8::Number;

	void Method(const FunctionCallbackInfo<Value>& args) {
	  Isolate* isolate = args.GetIsolate();
	  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world"));
	}

	void Add(const FunctionCallbackInfo<Value>& args) {
		Isolate* isolate = args.GetIsolate();

		if(args.Length() < 3) {
			isolate->ThrowException(Exception::TypeError(
				String::NewFromUtf8(isolate, "Wrong number of arguments")));
			return;
		}

		if(!args[0]->IsNumber() || !args[1]->IsNumber() || !args[2]->IsFunction()) {
			isolate->ThrowException(Exception::TypeError(
				String::NewFromUtf8(isolate, "Wrong arguments")));
			return;
		}

		double value = args[0]->NumberValue() + args[1]->NumberValue();
		Local<Number> num = Number::New(isolate, value);
		Local<Value> argv[1] = { num };

		Local<Function> cb = Local<Function>::Cast(args[2]);
		cb->Call(Null(isolate), 1, argv);

		args.GetReturnValue().Set(num);
	}

	void init(Local<Object> exports) {
	  NODE_SET_METHOD(exports, "hello", Method);
	  NODE_SET_METHOD(exports, "add",   Add);
	}

	NODE_MODULE(addon, init)
}