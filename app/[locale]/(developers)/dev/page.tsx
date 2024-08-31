import {auth} from "@/lib/auth";
import github from "@/lib/github/github";
import githubApp from "@/lib/github/githubApp";
import database from "@/lib/database";
import {Suspense} from "react";
import ProfileProject from "@/components/dev/ProfileProject";
import ProjectRegisterForm from "@/components/dev/ProjectRegisterForm";

async function ProfileProjects({owner}: { owner: string }) {
  const repos = await githubApp.getAvailableRepositories(owner);
  const projects = await database.getProjects(repos.map(r => r.full_name));

  return (
    <>
      {projects.map(p => (
        <Suspense key={p.id} fallback={<p>Loading profile...</p>}>
          <ProfileProject mod={p}/>
        </Suspense>
      ))}
      {projects.length === 0 &&
          <div
              className="w-full border border-accent flex flex-col justify-center items-center rounded-sm my-4 h-48 gap-3">
              <span className="text-foreground font-medium">Looks like you haven't registered any projects yet</span>
              <span className="text-muted-foreground">Start by adding a project from the top bar</span>
          </div>
      }
    </>
  )
}

function Profile({name, desc, avatar_url, children}: {
  name: string,
  desc?: string,
  avatar_url: string,
  children?: any
}) {
  return (
    <div>
      <div className="my-5 flex flex-row justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-2xl font-mono">{name}</p>

          <p className="text-muted-foreground">{desc || ''}</p>
        </div>
        <img className="rounded-md" src={avatar_url} alt="Avatar" width={96} height={96}/>
      </div>

      <p className="text-xl border-b border-neutral-400 pb-2">Projects</p>

      <div className="flex flex-col divide-y divide-neutral-600">
        {children}
      </div>
    </div>
  )
}

export default async function Dev({searchParams}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = (await auth())!;

  const profile = await github.getUserProfile(session.access_token);

  const state = searchParams['setup_action'] !== undefined && searchParams['state'] !== undefined
    ? JSON.parse(atob(searchParams['state'] as string))
    : undefined;
  const defaultValues = {owner: profile.login};

  return (
    <div>
      <div className="flex flex-row justify-between">
        Project management dashboard

        <ProjectRegisterForm defaultValues={defaultValues} state={state}/>
      </div>

      <hr className="my-2 border-neutral-600"/>

      <Profile name={profile.name} desc={profile.bio} avatar_url={profile.avatar_url}>
        <Suspense fallback={(<div>Loading profile projects...</div>)}>
          <ProfileProjects owner={profile.login}/>
        </Suspense>
      </Profile>
    </div>
  )
}