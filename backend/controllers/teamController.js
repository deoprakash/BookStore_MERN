import Team from "../models/teamModel.js";
import path from "path";
import fs from "fs";

// CREATE TEAM MEMBER
export const createTeamMember = async (req, res, next) => {
    try {
        const photo = req.file?.path || null;
        const { name, role, department, email, phone, bio, linkedin, isActive, joinedAt } = req.body;

        const member = new Team({
            name, role, department, email,
            phone: phone || undefined,
            bio: bio || undefined,
            linkedin: linkedin || undefined,
            photo,
            isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
            joinedAt: joinedAt || undefined,
        });

        const saved = await member.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// GET ALL TEAM MEMBERS
export const getTeamMembers = async (req, res, next) => {
    try {
        const { department, isActive, search } = req.query;
        const filter = {};

        if (department) filter.department = department;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (search) {
            const regex = new RegExp(search, 'i');
            filter.$or = [
                { name: regex },
                { role: regex },
                { email: regex },
                { department: regex },
            ];
        }

        const members = await Team.find(filter).sort({ displayOrder: 1, joinedAt: -1 }).lean();
        res.json(members);
    } catch (err) {
        next(err);
    }
};

// GET SINGLE MEMBER
export const getTeamMemberById = async (req, res, next) => {
    try {
        const member = await Team.findById(req.params.id).lean();
        if (!member) return res.status(404).json({ message: "Team member not found." });
        res.json(member);
    } catch (err) {
        next(err);
    }
};

// UPDATE TEAM MEMBER
export const updateTeamMember = async (req, res, next) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) return res.status(404).json({ message: "Team member not found." });

        const { name, role, department, email, phone, bio, linkedin, isActive, joinedAt } = req.body;

        if (name !== undefined) member.name = name;
        if (role !== undefined) member.role = role;
        if (department !== undefined) member.department = department;
        if (email !== undefined) member.email = email;
        if (phone !== undefined) member.phone = phone;
        if (bio !== undefined) member.bio = bio;
        if (linkedin !== undefined) member.linkedin = linkedin;
        if (isActive !== undefined) member.isActive = isActive === 'true' || isActive === true;
        if (joinedAt !== undefined) member.joinedAt = joinedAt;

        // Replace photo if new one uploaded
        if (req.file) {
            // Local deletion bypassed for Cloudinary
            member.photo = req.file.path;
        }

        const updated = await member.save();
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE TEAM MEMBER
export const deleteTeamMember = async (req, res, next) => {
    try {
        const member = await Team.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ message: "Team member not found." });

        // Local deletion bypassed for Cloudinary

        res.json({ message: "Team member deleted successfully." });
    } catch (err) {
        next(err);
    }
};

// UPDATE TEAM ORDER
export const updateTeamOrder = async (req, res, next) => {
    try {
        const { members } = req.body;
        if (!members || !Array.isArray(members)) {
            return res.status(400).json({ message: "Invalid request format." });
        }

        const bulkOps = members.map((m) => ({
            updateOne: {
                filter: { _id: m._id },
                update: { displayOrder: m.displayOrder }
            }
        }));

        await Team.bulkWrite(bulkOps);
        res.json({ message: "Team order updated successfully." });
    } catch (err) {
        next(err);
    }
};
