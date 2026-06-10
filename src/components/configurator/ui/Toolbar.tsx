import { Download, Link2, Redo2, RotateCcw, Save, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { useConfiguratorStore } from "@/store/configurator-store";
import { buildShareUrl } from "@/lib/configurator/share";
import { downloadConfigAsJson, saveConfigToStorage } from "@/lib/configurator/persistence";
import { cn } from "@/lib/utils";

const buttonClass =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-on-surface-variant transition-all duration-200 hover:border-white/25 hover:bg-white/[0.08] hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-white/[0.03]";

/** Undo/redo, reset, save, export and share-link controls. */
export function Toolbar() {
  const parts = useConfiguratorStore((s) => s.parts);
  const past = useConfiguratorStore((s) => s.past);
  const future = useConfiguratorStore((s) => s.future);
  const undo = useConfiguratorStore((s) => s.undo);
  const redo = useConfiguratorStore((s) => s.redo);
  const reset = useConfiguratorStore((s) => s.reset);

  const handleSave = () => {
    saveConfigToStorage(parts);
    toast.success("Configuration saved", { description: "Your build is stored on this device." });
  };

  const handleExport = () => {
    downloadConfigAsJson(parts);
    toast.success("Configuration exported", { description: "Downloaded as shoe-configuration.json" });
  };

  const handleShare = async () => {
    const url = buildShareUrl(parts);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied", { description: "Paste it anywhere to share this build." });
    } catch {
      toast.message("Share link ready", { description: url });
    }
  };

  const handleReset = () => {
    reset();
    toast("Reset to factory configuration");
  };

  return (
    <div className="flex items-center gap-1.5">
      <button type="button" className={cn(buttonClass)} onClick={undo} disabled={past.length === 0} title="Undo">
        <Undo2 className="h-4 w-4" />
      </button>
      <button type="button" className={cn(buttonClass)} onClick={redo} disabled={future.length === 0} title="Redo">
        <Redo2 className="h-4 w-4" />
      </button>
      <button type="button" className={cn(buttonClass)} onClick={handleReset} title="Reset to default">
        <RotateCcw className="h-4 w-4" />
      </button>
      <div className="mx-1 h-5 w-px bg-white/10" />
      <button type="button" className={cn(buttonClass)} onClick={handleSave} title="Save configuration">
        <Save className="h-4 w-4" />
      </button>
      <button type="button" className={cn(buttonClass)} onClick={handleExport} title="Export as JSON">
        <Download className="h-4 w-4" />
      </button>
      <button type="button" className={cn(buttonClass)} onClick={handleShare} title="Copy share link">
        <Link2 className="h-4 w-4" />
      </button>
    </div>
  );
}
