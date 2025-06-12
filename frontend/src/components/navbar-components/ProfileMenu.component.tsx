import {useEffect, useRef, useState} from "react";
import {Activity, Bell, Cog, CreditCard, HelpCircle, LogOut, Moon, Settings, User} from "lucide-react";
import MenuItem from "@/components/ui-components/MenuItem.ui.tsx";
import {logout} from "@/features/auth/auth.slice.ts";
import {setSelectedWorkspace} from "@/features/workspaces/selectedWorkspace.slice.ts";
import {useAppDispatch} from "@/hooks.ts";
import {useNavigate} from "react-router-dom";

const ProfileMenu = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(setSelectedWorkspace(null));
        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <MenuItem
                onClick={() => setOpen(prev => !prev)}
                icon={User}
                className="rounded"
            />

            {open && (
                <div className="absolute right-0 mt-2 w-46 bg-white border rounded shadow-md z-20">
                    <MenuItem icon={User}
                              label="Personal Details"
                              onClick={() => console.log("Personal Details clicked")}
                              className="w-full"
                    />
                    <MenuItem icon={Settings}
                              label="Account Settings"
                              onClick={() => console.log("Account Settings clicked")}
                              className="w-full"
                    />
                    <MenuItem icon={Bell}
                              label="Notification Settings"
                              onClick={() => console.log("Notification Settings clicked")}
                              className="w-full"
                    />
                    <MenuItem icon={Moon}
                              label="Appearance"
                              onClick={() => console.log("Appearance clicked")}
                              className="w-full"
                    />
                    <MenuItem icon={HelpCircle}
                              label="Help & Support"
                              onClick={() => console.log("Help & Support clicked")}
                              className="w-full"
                    />
                    <MenuItem icon={CreditCard}
                              label="Billing"
                              onClick={() => console.log("Billing clicked")}
                              className="w-full"
                    />
                    <MenuItem icon={Activity}
                              label="Activity Log"
                              onClick={() => console.log("Activity Log clicked")}
                              className="w-full"
                    />
                    <MenuItem icon={LogOut}
                              label="Logout"
                              onClick={handleLogout}
                              className="text-red-600 hover:bg-red-100 w-full"
                    />
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;