import { useQuery, useMutation } from "@apollo/client/react";
import { USER_PROFILE_QUERY, UPDATE_USER_MUTATION } from "@/lib/api/user.api";
import { UserInfoForm, type UserInfoFormValues } from "@/components/Form/Forms/UserInfoForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  gender: "Female" | "Male" | "Other" | "";
  birthDate: string;
}

function ProfileAvatar({ name, lastname }: { name: string; lastname: string }) {
  const initials = [name[0], lastname[0]].filter(Boolean).join("").toUpperCase();
  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className="w-20 h-20 rounded-full bg-primary/70 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary-foreground">{initials}</span>
      </div>
      <p className="text-base font-semibold text-foreground">
        {name} {lastname}
      </p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 py-6 px-6">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-32 h-4 rounded-full" />
      </div>
      <div className="w-full flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="w-24 h-3 rounded-full" />
            <Skeleton className="w-full h-12 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const { refetchUser } = useAuth();
  const { data, loading } = useQuery<{ user: UserProfile }>(USER_PROFILE_QUERY, {
    fetchPolicy: "network-only",
  });

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => refetchUser(),
  });

  const user = data?.user;

  const handleSubmit = (values: UserInfoFormValues) => {
    updateUser({
      variables: {
        input: {
          name: values.name,
          lastname: values.lastname,
          phone: values.phone,
          gender: values.gender,
          birthDate: values.birthdate?.toISOString(),
        },
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>AdPaws | Mi perfil</title>
      </Helmet>

      <div className="h-full overflow-auto">
        <div className="px-6">
          {loading || !user ? (
            <ProfileSkeleton />
          ) : (
            <>
              <ProfileAvatar name={user.name} lastname={user.lastname} />
              <UserInfoForm
                onSubmit={handleSubmit}
                loading={updating}
                disableEmail
                hidePassword
                defaultValues={{
                  name: user.name,
                  lastname: user.lastname,
                  email: user.email,
                  phone: user.phone ?? "",
                  gender: user.gender ?? "",
                  birthdate: user.birthDate ? new Date(user.birthDate) : undefined,
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
