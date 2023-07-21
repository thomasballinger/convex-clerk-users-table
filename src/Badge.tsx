import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ChangeEvent, useMemo } from "react";

export default function Badge() {
  const user = useQuery(api.users.currentUser);
  const changeColor = useMutation(api.users.setColor);

  // Update user color no more than 10 times per second
  const throttledColorChange = useMemo(() => {
    const throttle = 100;
    let timer: ReturnType<typeof setTimeout>;
    let lastChange = 0;
    return (e: ChangeEvent<HTMLInputElement>) => {
      clearTimeout(timer);
      const color = e.target.value;
      timer = setTimeout(() => {
        changeColor({ color });
        lastChange = Date.now();
      }, Math.max(0, throttle - (Date.now() - lastChange)));
    };
  }, []);

  if (!user) return "No current user!";

  return (
    <p className="badge">
      <input type="color" value={user.color} onChange={throttledColorChange} />
      <span>
        Logged in as {user.clerkUser.first_name} {user.clerkUser.last_name}
      </span>
    </p>
  );
}
