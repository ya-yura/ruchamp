'use server';

export async function sendFeedback(
  prevState: string | undefined,
  formData: FormData,
) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/feedback`,
      {
        method: 'POST',
        body: JSON.stringify({ name, email, message }),
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const feedback = await res.json();
    if (res.ok && feedback) {
      return '200';
    } else {
      console.log('Error in sending feedback');
      throw new Error();
    }
  } catch (error) {
    return '400';
  }
}
