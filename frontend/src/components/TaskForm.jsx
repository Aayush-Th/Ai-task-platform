import { Binary, FileText, Sparkles, Type } from "lucide-react";
import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";

const operations = [
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
  { value: "reverse", label: "Reverse" },
  { value: "wordcount", label: "Wordcount" }
];

const TaskForm = ({ onCreateTask, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    inputText: "",
    operation: "uppercase"
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await onCreateTask(formData);
    if (created) {
      setFormData((prev) => ({ ...prev, title: "", inputText: "" }));
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Create New Task</h2>
            <p className="text-sm text-slate-400">Submit text transformations to the processing queue.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <Input
          label="Task title"
          icon={Type}
          required
          value={formData.title}
          placeholder="Monthly report formatter"
          onChange={(event) => setFormData({ ...formData, title: event.target.value })}
        />
        <Input
          label="Input text"
          icon={FileText}
          as="textarea"
          required
          value={formData.inputText}
          placeholder="Paste or type the text you want to process..."
          onChange={(event) => setFormData({ ...formData, inputText: event.target.value })}
        />
        <Input
          label="Operation"
          icon={Binary}
          as="select"
          value={formData.operation}
          options={operations}
          onChange={(event) => setFormData({ ...formData, operation: event.target.value })}
        />
        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          {loading ? "Creating task..." : "Create Task"}
        </Button>
      </form>
    </Card>
  );
};

export default TaskForm;
