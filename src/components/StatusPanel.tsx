interface StatusPanelProps {
  title: string
  description: string
}

export function StatusPanel({ title, description }: StatusPanelProps) {
  return (
    <section className="status-panel">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  )
}
