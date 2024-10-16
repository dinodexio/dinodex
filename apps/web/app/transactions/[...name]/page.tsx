export default function Page({ params }: { params: { name: string } }) {
    return <div>My Transactions: {params.name}</div>
  }