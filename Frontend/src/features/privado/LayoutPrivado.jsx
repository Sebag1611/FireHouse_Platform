import PanelLayout from './components/PanelLayout'

export default function LayoutPrivado({ children }) {
  return (
    <PanelLayout>
      {children}
    </PanelLayout>
  )
}