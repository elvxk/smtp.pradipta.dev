"use client";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import elvxk from "./elvxk";

export default function Home() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState({
    hostname: "",
    senderEmail: "",
    password: "",
    targetEmail: "",
    port: "",
    encryption: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelect = (value) => {
    setFormData({ ...formData, encryption: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formattedData = {
      ...formData,
      port: parseInt(formData.port, 10), // Konversi string ke number
    };

    try {
      const res = await fetch(`${url}/smtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await res.json();
      setResponse(data);
      setLoading(false);
      if (data.status === "success") {
        toast.success("Success", {
          description: "Email sent successfully!",
          position: "bottom-center",
          duration: 5000,
          style: {
            background: "green",
          },
        });
      } else {
        toast.warning("Failed", {
          description: data.message,
          position: "bottom-center",
          duration: 5000,
          style: {
            background: "red",
          },
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Error occurred while sending email.",
        position: "bottom-center",
        duration: 5000,
        style: {
          background: "orange",
        },
      });
      setResponse({ success: false, message: "Error occurred." });
    }
  };

  useEffect(() => {
    console.info(elvxk);
  }, []);

  return (
    <div className="flex items-center justify-center container mx-auto py-6">
      <div className="w-full max-w-2xl p-6 border-black border shadow-md rounded-md mx-6">
        <div className="flex justify-center ">
          <Image
            src="/smtpsen.webp"
            height={100}
            width={100}
            alt="logo smtp sender"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-center">SMTP Sender</h1>
        <p className="text-sm text-center mb-6">Check your SMTP connection</p>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-2">
          <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-2">
            <Label className="text-sm font-medium">Hostname</Label>
            <Input
              type="text"
              name="hostname"
              value={formData.hostname}
              onChange={handleChange}
              placeholder="smtp.domain.com"
              className="col-span-3 w-full"
              required
            />
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-2">
            <Label className="text-sm font-medium">Sender Email</Label>
            <Input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleChange}
              placeholder="sendermail@domain.com"
              className="col-span-3 w-full"
              required
            />
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-2">
            <Label className="text-sm font-medium">Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="email password"
              className="col-span-3 w-full"
              required
            />
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-2">
            <Label className="text-sm font-medium">Target Email</Label>
            <Input
              type="email"
              name="targetEmail"
              value={formData.targetEmail}
              onChange={handleChange}
              placeholder="targetmail@domain.com"
              className="col-span-3 w-full"
              required
            />
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-2">
            <Label className="text-sm font-medium">Port</Label>
            <Input
              type="number"
              name="port"
              value={formData.port}
              onChange={handleChange}
              placeholder="e.g., 465"
              className="col-span-3 w-full"
              required
            />
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center sm:gap-2">
            <Label className="text-sm font-medium">Encryption</Label>
            <div className="col-span-3">
              <Select name="encryption" onValueChange={handleSelect}>
                <SelectTrigger className="w-full border">
                  <SelectValue placeholder="Select Encryption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="tls">TLS/STARTTLS</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Spinner size="small" className="text-white" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Test SMTP"
              )}
            </Button>
          </div>
        </form>
        {/* {response && ( */}
        {/*   <div className="mt-4 text-center"> */}
        {/*     <p className="text-sm">{response.message}</p> */}
        {/*   </div> */}
        {/* )} */}
      </div>
    </div>
  );
}
