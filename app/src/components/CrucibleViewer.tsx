interface Props {
  config: object | null;
}

export const CrucibleViewer = ({ config }: Props) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg h-full overflow-auto">
      <h3 className="text-lg font-bold mb-2">👁️ Crucible Viewer</h3>
      <pre className="text-xs">{JSON.stringify(config, null, 2)}</pre>
    </div>
  );
};