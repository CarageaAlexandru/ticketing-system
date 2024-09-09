export default function TenantName(props) {
  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight text-white">
        Ticket System {props.tenant}
      </h1>
    </div>
  );
}
