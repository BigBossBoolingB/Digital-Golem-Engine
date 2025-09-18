interface Props {
  jsonData: object;
}

export const CrucibleViewer = ({ jsonData }: Props) => {
  return (
    <div className="p-4 bg-black rounded-lg h-full overflow-auto">
      <h3 className="text-lg font-bold mb-2">👁️ Crucible Viewer</h3>
      <pre className="text-xs">{JSON.stringify(jsonData, null, 2)}</pre>
    </div>
  );
};
