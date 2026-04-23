import { ArrowDownAZ, Funnel, Search } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";

const TaskFilters = ({ filters, onChange, onReset }) => {
  return (
    <Card className="p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <div className="xl:col-span-2">
          <Input
            label="Search"
            icon={Search}
            placeholder="Search by title"
            value={filters.q}
            onChange={(event) => onChange({ q: event.target.value, page: 1 })}
          />
        </div>
        <Input
          label="Status"
          icon={Funnel}
          as="select"
          value={filters.status}
          onChange={(event) => onChange({ status: event.target.value, page: 1 })}
          options={[
            { value: "all", label: "All statuses" },
            { value: "pending", label: "Pending" },
            { value: "running", label: "Running" },
            { value: "success", label: "Success" },
            { value: "failed", label: "Failed" }
          ]}
        />
        <Input
          label="Operation"
          as="select"
          value={filters.operation}
          onChange={(event) => onChange({ operation: event.target.value, page: 1 })}
          options={[
            { value: "all", label: "All operations" },
            { value: "uppercase", label: "Uppercase" },
            { value: "lowercase", label: "Lowercase" },
            { value: "reverse", label: "Reverse" },
            { value: "wordcount", label: "Wordcount" }
          ]}
        />
        <Input
          label="Sort by"
          icon={ArrowDownAZ}
          as="select"
          value={filters.sortBy}
          onChange={(event) => onChange({ sortBy: event.target.value })}
          options={[
            { value: "createdAt", label: "Created date" },
            { value: "updatedAt", label: "Updated date" },
            { value: "title", label: "Title" }
          ]}
        />
        <Input
          label="Order"
          as="select"
          value={filters.sortOrder}
          onChange={(event) => onChange({ sortOrder: event.target.value })}
          options={[
            { value: "desc", label: "Descending" },
            { value: "asc", label: "Ascending" }
          ]}
        />
      </div>
      <div className="mt-3 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </Card>
  );
};

export default TaskFilters;
