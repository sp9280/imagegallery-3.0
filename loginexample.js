import { useAuth } from "../../hooks/useAuth";

const { loginUser } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await loginUser(identifier, password);
  if (result.success) navigate("/");
  else setError(result.error);
};
